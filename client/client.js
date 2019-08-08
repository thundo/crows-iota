'use strict';

const {composeAPI} = require('@iota/core');
const config = require('config');

console.log(config);

const nodeAddress = 'https://nodes.devnet.iota.org:443';
const zmqNodeAddress = 'tcp://zmq.devnet.iota.org:5556';

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

    // Address deterministic generation
    const serverAddress = await iota.getNewAddress(config.seed, {index: 0});
    console.log(serverAddress);

    // const sendingAddress = await iota.getNewAddress(config.seed, {index: 1});
    // console.log(sendingAddress);

    const accountData = await iota.getAccountData(config.seed, {end: 10});
    console.log(accountData);

    const transfers = [
        {
            value: 500,
            address: serverAddress,
            tag: 'MYMAGIC'
        }
    ];
    const trytes = await iota.prepareTransfers(config.seed, transfers);
    const response = await iota.sendTrytes(trytes, 3, 9);

    console.log('Bundle sent');
    response.map(tx => console.log(tx));
};
