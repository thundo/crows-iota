'use strict';

const {composeAPI} = require('@iota/core');
const config = require('config');
const utils = require('../core/utils');

console.log(config);

const nodeAddress = 'https://nodes.devnet.iota.org:443';

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

    await utils.sendZeroValueTx(iota, config.seed, config.serverAddress, message);
};
