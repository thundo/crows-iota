'use strict';

const PromisePool = require('es6-promise-pool');
const paymentConcurrentLimit = 3;
const config = require('config').crows;

class Payer {
    constructor (iota, members, payments) {
        this.iota = iota;
        this.members = members;
        this.payments = payments;
    }

    start () {
        const self = this;
        this.intervalId = setInterval(() => {
            const boundPromiseProducer = self._promiseProducer.bind(this);
            const pool = new PromisePool(boundPromiseProducer, paymentConcurrentLimit);
            const poolPromise = pool.start();
            // boundPromiseProducer();
        }, config.paymentInterval);
    }

    _promiseProducer() {
        console.log('Running payer');
        Object.entries(this.members).forEach(([k, v]) => {
            console.log(k);
            if (v.unpaid_measurements > config.paymentThreshold) {
                console.log(`Paying ${v.name} (#${k})`);
                v.unpaid_measurements = 0;
            }
        });
    }

    dispose () {
        if (this.intervalId !== undefined) {
            clearImmediate(this.intervalId);
        }
    }
}

module.exports = Payer;
