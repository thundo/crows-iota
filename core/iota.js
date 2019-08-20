'use strict';

const {composeAPI, generateAddress} = require('@iota/core');
const {asciiToTrytes} = require('@iota/converter');
const {isValidChecksum} = require('@iota/checksum');

class Iota {
    constructor(seed, iriUri, options = {}) {
        this.provider = null;
        this.CROWS_TAG = 'CROWS';
        this.seed = seed;
        this.iriUri = iriUri;
        this.options = options;
    }

    async initialize() {
        this.provider = await composeAPI({
            provider: this.iriUri,
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

    async sendZeroValueTx(recipient, data) {
        const transfers = [{
            value: 0,
            address: recipient,
            tag: this.CROWS_TAG,
            message: data ? asciiToTrytes(JSON.stringify(data)) : null,
        }];
        const trytes = await this.provider.prepareTransfers(this.seed, transfers, {});
        const bundle = await this.provider.sendTrytes(trytes, this.options.depth, this.options.minWeightMagnitude);
        console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
        return bundle[0].hash;
    }

    async sendValueTx(recipient, value) {
        const transfers = [{
            value: value,
            address: recipient,
            tag: this.CROWS_TAG,
        }];
        const trytes = await this.provider.prepareTransfers(this.seed, transfers, {});
        const bundle = await this.provider.sendTrytes(trytes, this.options.depth, this.options.minWeightMagnitude);
        console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
        return bundle[0].hash;
    }

    async generateAddress(index) {
        return generateAddress(this.seed, index, this.options.security);
    }

    static isAddressValid(address) {
        return /^[A-Z9]{81}$/.test(address) ||
            (/^[A-Z9]{90}$/.test(address) && isValidChecksum(address));
    }

    async newAttachedAddress() {
        const newAddress = await this.provider.getNewAddress(this.seed, {security: this.options.security});
        console.log(newAddress);
        await this.sendZeroValueTx(newAddress, null);
        return newAddress;
    }
}
module.exports = Iota;
