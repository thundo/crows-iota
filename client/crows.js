'use strict';

const axios = require('axios');
const config = require('config');
const constants = require('../core/constants');

class Crows {
    constructor(iota) {
        this.iota = iota;
        this.stationId = null;
    }
    async register(paymentAddress) {
        const client = axios.create();
        const data = {
            external_id: config.id,
            name: config.name,
            latitude: config.latitude,
            longitude: config.longitude,
            altitude: config.altitude,
            payment_address: paymentAddress,
        };
        try {
            const response = await client.post(`${config.crows.baseUrl}/api/stations`, data);
            console.log(response.data);
            this.stationId = response.data.station_id;
        } catch (e) {
            console.error(e.response.data);
            throw e;
        }
    }

    async measure() {
        return Promise.resolve();
        const req = {
            command: constants.COMMAND_MEASUREMENT,
            temperature: 28.5,
            humidity: 63.3,
            dt: Date.now(),
        };
        return await this.iota.sendZeroValueTx(config.iota.seed, config.iota.serverAddress, req);
    }
}

module.exports = Crows;
