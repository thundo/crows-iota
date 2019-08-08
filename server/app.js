'use strict';

const {composeAPI} = require('@iota/core');
const config = require('config');
const zmq = require('zeromq');
const sock = zmq.socket('sub');

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
    const address = await iota.getNewAddress(config.seed);
    console.log(address);

    sock.connect(zmqNodeAddress);
    console.log('Connected to ' + zmqNodeAddress);
    sock.subscribe('sn'); // sn = confirmed tx
    sock.subscribe(address); // subscribe to own address
    console.log('Subscribed to messages...');
    sock.on('message',(msg) => {
        let data = msg.toString().split(' ');
        console.log(data);
        console.log(`Transaction confirmed by milestone index: ${data[1]}` );
        console.log(`Transaction hash: ${data[2]}` );
    })
};
