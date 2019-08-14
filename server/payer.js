'use strict';

const PromisePool = require('es6-promise-pool');
const paymentConcurrentLimit = 3;
const config = require('config');

class Payer {
    constructor (members, payments) {
        function promiseProducer() {
            for (let i = 0; i < members.length; i += 1) {
                console.log(members[i]);
                if (members[i].unpaid_measurements > config.crows.paymentThrehsold) {
                }
            }
        }

        this.intervalId = setInterval(() => {
            const pool = new PromisePool(promiseProducer, paymentConcurrentLimit);
            const poolPromise = pool.start();

        }, config.paymentInterval);
    }

    dispose () {
        if (this.intervalId !== undefined) {
            clearImmediate(this.intervalId);
        }
    }
}

module.exports = Payer;
