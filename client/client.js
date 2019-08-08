'use strict';

const {composeAPI} = require('@iota/core');
const config = require('config');
const {asTransactionObject} = require('@iota/transaction-converter')

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
    console.log(accountData.addresses[0]);

    const transfers = [{
        value: 500,
        address: accountData.addresses[0],
        tag: 'THUNDOWASHERE',
    }];
    const trytes = await iota.prepareTransfers(config.seed, transfers, {});
    const bundle  = await iota.sendTrytes(trytes, depth, minWeightMagnitude);

    console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
};
