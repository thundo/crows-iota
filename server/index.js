const {composeAPI} = require('@iota/core');
const config = require('config');
const zmq = require('zeromq');
const sock = zmq.socket('sub');

console.log(config)

const zmqNodeAddress = 'tcp://zmq.devnet.iota.org:5556';


const iota = composeAPI({
    provider: 'https://nodes.devnet.iota.org:443',
    // provider: 'https://nodes.iota.cafe:443',
});

iota.getNodeInfo()
    .then((info) => {
        console.log(info);
        if (Math.abs(info['latestMilestoneIndex'] - info['latestSolidSubtangleMilestoneIndex']) > 3) {
            console.log('\r\nNode is probably not synced!');
        } else {
            console.log('\r\nNode is probably synced!');
        }

        try {
            sock.connect(zmqNodeAddress);
            console.log('Connected to ' + zmqNodeAddress);
            sock.subscribe('sn'); // sn = confirmed tx
            console.log('Subscribed to messages...');
            sock.on('message',(msg) => {
                let data = msg.toString().split(' ');
                console.log(data);
                console.log(`Transaction confirmed by milestone index: ${data[1]}` );
                console.log(`Transaction hash: ${data[2]}` );
            })
        } catch (error) {
            console.log(error)
        }

    })
    .catch((error) => {
        console.log(error);
        console.log(`Request error: ${error.message}`)
    });
