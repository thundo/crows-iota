'use strict';


const config = require('config');
const constants = require('../core/constants');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const createApi = require('./api');
const Dlt = require('./dlt');

console.log(config);

class Server {
    constructor() {
        this.app = express();
        this.app.set('port', config.web.port);
        this.app.use(bodyParser.json());
        this.app.use(cors({
            origin: '*'
        }));
        this.app.use((req, res, next) => {
            res.err = (err) => {
                const result = {error: true};
                result.message = err;
                res.send(result);
            };
            next();
        });

        this.dlt = new Dlt();

        this.members = {};
        this.payments = [];
        this.data = [];
    }

    async start() {
        this.app.use('/api', createApi(this.members));
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
