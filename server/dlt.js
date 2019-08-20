'use strict';

const {extractJson} = require('@iota/extract-json');
const zmq = require('zeromq');
const config = require('config').iota;
const constants = require('../core/constants');
const omit = require('lodash.omit');

class Dlt {
    constructor(iota, members, data) {
        this.iota = iota;
        this.sock = zmq.socket('sub');
        this.members = members;
        this.data = data;
    }

    async start() {
        const provider = this.iota.getProvider();

        // Address deterministic generation
        const dataAddress = await this.iota.generateAddress(config.seed, 0);
        console.log(dataAddress);

        this.sock.connect(config.zmqUri);
        console.log('Connected to ' + config.zmqUri);
        // sock.subscribe('sn'); // sn = confirmed tx
        this.sock.subscribe(dataAddress); // subscribe to data address
        console.log(`Subscribed to ${dataAddress} updates...`);
        this.sock.on('message', async (msg) => {
            const data = msg.toString().split(' ');
            console.log(`Tx address: ${data[0]}`);
            console.log(`Tx hash: ${data[1]}`);
            console.log(`Tx milestone: ${data[2]}`);
            console.log(`Tx type: ${data[3]}`);
            const tx = await provider.getTransactionObjects([data[1]]);
            const message = JSON.parse(extractJson(tx));
            console.log(message);
            if (!this.members[message.station_id]) {
                console.error('Invalid station id');
                return;
            }
            switch (message.command) {
                case constants.COMMAND_MEASUREMENT:
                    this.data.push(omit(message, ['command']));
                    this.members[message.station_id].unpaid_measurements++;
                    break;
            }
        });
    }

    async dispose() {
        if (this.sock !== undefined) {
            this.sock.close();
        }
    }
}

module.exports = Dlt;
