'use strict';

const config = require('config').crows;
const {PAYER_RUNNING, PAYER_PAYMENT_SUCCESS, PAYER_PAYMENT_FAILED} = require('../core/constants');
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
        logger.verbose('Running payer...');
        this.emit(PAYER_RUNNING);
        const toBePaid = filter(Object.values(this.members), (m) => m.unpaid_measurements > config.paymentThreshold);
        const paymentPromises = [];
        for (let i = 0; i < toBePaid.length; i++) {
            const station = toBePaid[i];
            const paymentPromise = new Promise(async (resolve, reject) => {
                try {
                    await this.iota.sendValueTx(station.payment_address, station.unpaid_measurements);
                } catch (e) {
                    logger.warn(`Unable to pay ${station.unpaid_measurements} measurements to ${station.name} (${station.station_id})`);
                    this.emit(PAYER_PAYMENT_FAILED, e.message);
                    return reject(e);
                }
                const payment = {
                    name: station.name,
                    station_id: station.station_id,
                    address: station.payment_address,
                    amount: station.unpaid_measurements,
                    created_at: Date.now(),
                };
                this.payments.push(payment);
                this.emit(PAYER_PAYMENT_SUCCESS, payment);
                this.members[station.station_id].unpaid_measurements = 0;
                logger.info(`Paid ${station.unpaid_measurements} measurements to ${station.name} (${station.station_id})`);
                return resolve();
            });
            paymentPromises.push(paymentPromise);
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
