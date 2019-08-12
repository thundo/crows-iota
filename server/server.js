'use strict';

const config = require('config');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const createApi = require('./api');
const Dlt = require('./dlt');

console.log(config);

class Server {
    constructor() {
        this.members = {};
        this.payments = [];
        this.data = [];

        this.app = express();
        this.app.set('port', config.web.port);
        this.app.use(bodyParser.json());
        this.app.use(cors({
            origin: '*'
        }));
        this.app.use('/api', createApi(this.members));
        this.app.use((err, req, res, next) => {
            const result = {
                message: err.message,
                payload: err.payload,
            };
            const status = err.code || 500;
            console.error(`ErrorMiddleware caught an error code=${result.code} status=${result.status}: ${err} `);
            res.status(status).send(result);
        });

        this.dlt = new Dlt();
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
    }
}

module.exports = Server;
