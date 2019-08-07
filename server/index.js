const {composeAPI} = require('@iota/core');
const config = require('config');

console.log(config)

const iota = composeAPI({
    provider: 'https://nodes.iota.cafe:443',
})

iota.getNodeInfo()
    .then((info) => {
        console.log(info);
        if (Math.abs(info['latestMilestoneIndex'] - info['latestSolidSubtangleMilestoneIndex']) > 3) {
            console.log('\r\nNode is probably not synced!');
        } else {
            console.log('\r\nNode is probably synced!');
        }
    })
    .catch((error) => {
        console.log(error);
        console.log(`Request error: ${error.message}`)
    })