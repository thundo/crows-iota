'use strict';

const {composeAPI, generateAddress} = require('@iota/core');
const {asciiToTrytes} = require('@iota/converter');
const config = require('config').iota;

class Iota {
    constructor() {
        this.provider = null;
    }

    async initialize() {
        this.provider = await composeAPI({
            provider: config.iriUri,
        });
        const nodeInfo = await this.provider.getNodeInfo();
        if (Math.abs(nodeInfo['latestMilestoneIndex'] - nodeInfo['latestSolidSubtangleMilestoneIndex']) > 3) {
            throw new Error('Node is probably not synced!');
        } else {
            console.log('Node is probably synced!');
        }
    }

    getProvider() {
        return this.provider;
    }

    async sendZeroValueTx(seed, recipient, data) {
        console.log(asciiToTrytes(JSON.stringify(data)));
        console.log(asciiToTrytes(JSON.stringify(data)).length);
        const transfers = [{
            value: 0,
            address: recipient,
            tag: 'CROWS',
            message: asciiToTrytes(JSON.stringify(data)),
        }];
        const trytes = await this.provider.prepareTransfers(seed, transfers, {});
        const bundle = await this.provider.sendTrytes(trytes, config.depth, config.minWeightMagnitude);
        console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
        return bundle[0].hash;
    }

    async generateAddress(seed, index) {
        return generateAddress(seed, index, config.security);
    }

}
module.exports = Iota;
