'use strict';

const config = require('config');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const createApi = require('./api');
const Dlt = require('./dlt');
const Payer = require('./payer');

console.log(config);

class Server {
    constructor() {
        this.members = {};
        this.data = [];
        this.payments = [];

        this.app = express();
        this.app.set('port', config.web.port);
        this.app.use(bodyParser.json());
        this.app.use(cors({
            origin: '*',
        }));
        this.app.use('/api', createApi(this.members));
        this.app.use((err, req, res, next) => {
            const result = {
                message: err.message,
                payload: err.payload,
            };
            const status = err.code || 500;
            console.error(`ErrorMiddleware caught an error code=${err.code}: ${err} `);
            res.status(status).send(result);
        });

        this.dlt = new Dlt(this.members, this.data, this.payments);
        this.payer = new Payer(this.members, this.payments);
    }

    async start() {
        this.web = this.app.listen(this.app.get('port'), () => {
            console.log('HTTP web started on port %d.', this.app.get('port'));
        });
        this.dlt.start();
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
