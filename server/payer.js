'use strict';

const config = require('config').crows;
const logger = require('./logger');
const filter = require('lodash.filter');

class Payer {
    constructor(iota, members, payments) {
        this.iota = iota;
        this.members = members;
        this.payments = payments;
    }

    async start() {
        const self = this;
        this.intervalId = setInterval(async () => {
            return await Promise.all(self._paymentsProducer());
        }, config.paymentInterval);
    }

    _paymentsProducer() {
        logger.info('Running payer...');
        const toBePaid = filter(Object.values(this.members), (m) => m.unpaid_measurements > config.paymentThreshold);
        const paymentPromises = [];
        for (let i = 0; i < toBePaid.length; i++) {
            const station = toBePaid[i];
            logger.verbose(`Paying ${station.unpaid_measurements} measurements to ${station.name} (${station.station_id})`);
            paymentPromises.push(this.iota.sendValueTx(station.payment_address, station.unpaid_measurements));
        }
        return paymentPromises;
    }

    dispose() {
        if (this.intervalId !== undefined) {
            clearImmediate(this.intervalId);
        }
    }
}

module.exports = Payer;
