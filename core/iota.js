'use strict';

const {composeAPI, generateAddress} = require('@iota/core');
const {asciiToTrytes} = require('@iota/converter');
const {isValidChecksum} = require('@iota/checksum');
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
        const transfers = [{
            value: 0,
            address: recipient,
            tag: 'CROWS',
            message: data ? asciiToTrytes(JSON.stringify(data)) : null,
        }];
        const trytes = await this.provider.prepareTransfers(seed, transfers, {});
        const bundle = await this.provider.sendTrytes(trytes, config.depth, config.minWeightMagnitude);
        console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
        return bundle[0].hash;
    }

    async generateAddress(seed, index) {
        return generateAddress(seed, index, config.security);
    }

    static isAddressValid(address) {
        return /^[A-Z9]{81}$/.test(address) ||
            (/^[A-Z9]{90}$/.test(address) && isValidChecksum(address));
    }

    async newAttachedAddress(seed) {
        const newAddress = await this.provider.getNewAddress(seed, {security: config.security});
        console.log(newAddress);
        await this.sendZeroValueTx(seed, newAddress, null);
        return newAddress;
    }
}
module.exports = Iota;
