'use strict';

const config = require('config');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const createApi = require('./api');
const Iota = require('../core/iota');
const Dlt = require('./dlt');
const Payer = require('./payer');
const logger = require('./logger');
const expressWs = require('express-ws');
const handleWs = require('./ws');
const createFrontend = require('./frontend');

class Server {
    constructor() {
        this.members = {};
        this.data = [];
        this.payments = [];

        this.iota = new Iota(config.iota.seed, config.iota.iriUri, config.iota.options, logger);
        this.dlt = new Dlt(this.iota, this.members, this.data, this.payments);
        this.payer = new Payer(this.iota, this.members, this.payments);

        this.app = express();
        this.app.set('view options', {layout: false});
        this.app.use(express.static(__dirname + '/public'));
        expressWs(this.app, undefined, {leaveRouterUntouched: true});
        this.app.set('port', config.web.port);
        this.app.use(bodyParser.json());
        this.app.use(cors({
            origin: '*',
        }));
        this.app.use('/', createFrontend());
        this.app.use('/api', createApi(this.app, this.members));
        this.app.ws('/ws', (ws, req) => {
            handleWs(ws, req, this.app, this.dlt, this.payer, this.iota);
        });
        // this.app.use((err, req, res) => {
        //     const result = {
        //         message: err.message,
        //         payload: err.payload,
        //     };
        //     const status = err.code || 500;
        //     logger.warn(`ErrorMiddleware caught an error code=${err.code}: ${err} `);
        //     res.status(status).send(result);
        // });
    }

    async start() {
        this.web = this.app.listen(this.app.get('port'), () => {
            logger.info(`HTTP web started on port ${this.app.get('port')}`);
        });
        await this.iota.initialize();
        this.dlt.start();
        this.payer.start();
    }

    dispose() {
        if (this.web !== undefined) {
            this.web.close();
            this.web = undefined;
        }
        this.dlt.dispose();
        this.payer.dispose();
    }
}

module.exports = Server;
