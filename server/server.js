'use strict';

const {extractJson} = require('@iota/extract-json');
const config = require('config');
const zmq = require('zeromq');
const sock = zmq.socket('sub');
const Iota = require('../core/iota');
const constants = require('../core/constants');

console.log(config);

const zmqNodeAddress = 'tcp://zmq.devnet.iota.org:5556';

const members = [];
const payments = [];
const data = [];

module.exports = async () => {
    const iota = new Iota();
    await iota.initialize();
    const provider = iota.getProvider();

    // Address deterministic generation
    const dataAddress = await iota.generateAddress(config.iota.seed, 0);
    console.log(dataAddress);

    sock.connect(zmqNodeAddress);
    console.log('Connected to ' + zmqNodeAddress);
    // sock.subscribe('sn'); // sn = confirmed tx
    sock.subscribe(dataAddress); // subscribe to data address
    console.log(`Subscribed to ${dataAddress} updates...`);
    sock.on('message', async (msg) => {
        let data = msg.toString().split(' ');
        console.log(`Tx address: ${data[0]}`);
        console.log(`Tx hash: ${data[1]}`);
        console.log(`Tx milestone: ${data[2]}`);
        console.log(`Tx type: ${data[3]}`);
        const tx = await provider.getTransactionObjects([data[1]]);
        // console.log(tx);
        const message = extractJson(tx);
        console.log(message)
        switch (message.command) {
            case constants.COMMAND_REGISTRATION:
                console.log('Registration');
                break;
            case constants.COMMAND_MEASUREMENT:
                console.log('Measurement');
                break;
        }
    });
};
