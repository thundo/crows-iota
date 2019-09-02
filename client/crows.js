'use strict';

const axios = require('axios');
const config = require('config');
const constants = require('../core/constants');
const logger = require('./logger');
const sensor = require("node-dht-sensor").promises;

class Crows {
    constructor(iota) {
        this.iota = iota;
        this.stationId = null;
        this.intervalId = null;
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
        logger.info(`Registering station with payment address ${paymentAddress}`);
        try {
            const response = await client.post(`${config.crows.baseUrl}/api/stations`, data);
            this.stationId = response.data.station_id;
            logger.info(`Station registered with id ${this.stationId}`);
        } catch (e) {
            logger.error(e.message);
            throw e;
        }
    }

    async runLoop() {
        this.intervalId = setInterval(async () => {
            let readout;
            try {
                readout = await sensor.read(config.sensor.type, config.sensor.pin);
            } catch (e) {
                logger.error(`Failed to read sensor data: ${e.message}`);
                return;
            }

            const req = {
                command: constants.COMMAND_MEASUREMENT,
                temperature: readout.temperature,
                humidity: readout.humidity,
                dt: Date.now(),
                station_id: this.stationId,
            };
            logger.info('Publishing measurement...');
            return await this.iota.sendZeroValueTx(config.iota.serverAddress, req);
        }, config.crows.measurementInterval);
    }

    dispose () {
        if (this.intervalId !== undefined) {
            clearInterval(this.intervalId);
        }
    }
}

module.exports = Crows;
