'use strict';

const {composeAPI} = require('@iota/core');
const {asciiToTrytes} = require('@iota/converter');
const config = require('config');

console.log(config);

const nodeAddress = 'https://nodes.devnet.iota.org:443';
const depth = 3;
const minWeightMagnitude = 9;

module.exports = async () => {
    // Node connection
    const iota = composeAPI({
        provider: nodeAddress,
    });
    const nodeInfo = await iota.getNodeInfo();
    if (Math.abs(nodeInfo['latestMilestoneIndex'] - nodeInfo['latestSolidSubtangleMilestoneIndex']) > 3) {
        throw new Error('Node is probably not synced!');
    } else {
        console.log('Node is probably synced!');
    }

    const accountData = await iota.getAccountData(config.seed);
    console.log(accountData);

    const message = {
        temperature: 28.5,
        humidity: 63.3,
        dt: Date.now()
    };

    console.log(message);
    console.log(asciiToTrytes(JSON.stringify(message)));
    console.log(asciiToTrytes(JSON.stringify(message)).length);

    const transfers = [{
        value: 0,
        address: config.serverAddress,
        tag: 'CROWS',
        message: asciiToTrytes(JSON.stringify(message)),
    }];
    const trytes = await iota.prepareTransfers(config.seed, transfers, {});
    const bundle  = await iota.sendTrytes(trytes, depth, minWeightMagnitude);

    console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
};
