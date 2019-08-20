'use strict';

const PromisePool = require('es6-promise-pool');
const paymentConcurrentLimit = 3;
const config = require('config').crows;
const logger = require('./logger');

class Payer {
    constructor(iota, members, payments) {
        this.iota = iota;
        this.members = members;
        this.payments = payments;
    }

    start() {
        const self = this;
        this.intervalId = setInterval(() => {
            const boundPromiseProducer = self._promiseProducer.bind(this);
            const pool = new PromisePool(boundPromiseProducer, paymentConcurrentLimit);
            const poolPromise = pool.start();
        }, config.paymentInterval);
    }

    _promiseProducer() {
        logger.info('Running payer...');
        Object.entries(this.members).forEach(([k, v]) => {
            if (v.unpaid_measurements > config.paymentThreshold) {
                logger.verbose(`Paying ${v.unpaid_measurements} measurements for ${v.name} (${k})`);
                // this.iota.sendValueTx()
                v.unpaid_measurements = 0;
            }
        });
    }

    dispose() {
        if (this.intervalId !== undefined) {
            clearImmediate(this.intervalId);
        }
    }
}

module.exports = Payer;
