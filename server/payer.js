'use strict';

const config = require('config').crows;
const {PAYER_RUNNING, PAYER_PAYMENT} = require('../core/constants');
const logger = require('./logger');
const filter = require('lodash.filter');
const EventEmitter = require('events');

class Payer extends EventEmitter {
    constructor(iota, members, payments) {
        super();
        this.iota = iota;
        this.members = members;
        this.payments = payments;
    }

    async start() {
        this.intervalId = setInterval(async () => {
            return await Promise.all(this._paymentsProducer());
        }, config.paymentInterval);
    }

    _paymentsProducer() {
        logger.info('Running payer...');
        this.emit(PAYER_RUNNING);
        const toBePaid = filter(Object.values(this.members), (m) => m.unpaid_measurements > config.paymentThreshold);
        const paymentPromises = [];
        for (let i = 0; i < toBePaid.length; i++) {
            const station = toBePaid[i];
            logger.verbose(`Paying ${station.unpaid_measurements} measurements to ${station.name} (${station.station_id})`);
            paymentPromises.push(this.iota.sendValueTx(station.payment_address, station.unpaid_measurements));
            const payment = {
                name: station.name,
                id: station.station_id,
                address: station.payment_address,
                amount: station.unpaid_measurements,
                created_at: Date.now(),
            };
            this.payments.push(payment);
            this.emit(PAYER_PAYMENT, payment);
            station.unpaid_measurements = 0;
        }
        return paymentPromises;
    }

    dispose() {
        if (this.intervalId !== undefined) {
            clearInterval(this.intervalId);
        }
    }
}

module.exports = Payer;
