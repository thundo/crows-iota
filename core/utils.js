'use strict';

const {composeAPI} = require('@iota/core');
const {asciiToTrytes} = require('@iota/converter');
const config = require('config');

const getProvider = async () => {
    const iota = await composeAPI({
        provider: config.iriUri,
    });
    const nodeInfo = await iota.getNodeInfo();
    if (Math.abs(nodeInfo['latestMilestoneIndex'] - nodeInfo['latestSolidSubtangleMilestoneIndex']) > 3) {
        throw new Error('Node is probably not synced!');
    } else {
        console.log('Node is probably synced!');
    }
    return iota;
};

const sendZeroValueTx = async (provider, seed, recipient, data) => {
    console.log(asciiToTrytes(JSON.stringify(data)));
    console.log(asciiToTrytes(JSON.stringify(data)).length);
    const transfers = [{
        value: 0,
        address: recipient,
        tag: 'CROWS',
        message: asciiToTrytes(JSON.stringify(data)),
    }];
    const trytes = await provider.prepareTransfers(seed, transfers, {});
    const bundle = await provider.sendTrytes(trytes, config.depth, config.minWeightMagnitude);
    console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
    return bundle[0].hash;
};

module.exports = {
    getProvider,
    sendZeroValueTx,
};
