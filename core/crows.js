'use strict';

const config = require('config');
const constants = require('./constants');
const nanoid = require('nanoid');


class Crows {
    constructor (iota) {
        this.iota = iota;
    }
    async register() {
        const req = {
            command: constants.COMMAND_REGISTRATION,
            external_id: config.id || nanoid(),
            name: config.name,
            latitude: config.latitude,
            longitude: config.longitude,
            altitude: config.altitude,
        };
        return await this.iota.sendZeroValueTx(config.seed, config.serverAddress, req);
    }

    async measure() {
        const req = {
            command: constants.COMMAND_MEASUREMENT,
            temperature: 28.5,
            humidity: 63.3,
            dt: Date.now()
        };
        return await this.iota.sendZeroValueTx(config.seed, config.serverAddress, req);
    }
}

module.exports = Crows;
