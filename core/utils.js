'use strict';

const {asciiToTrytes} = require('@iota/converter');
const depth = 3;
const minWeightMagnitude = 9;

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
    const bundle = await provider.sendTrytes(trytes, depth, minWeightMagnitude);
    console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
    return bundle[0].hash;
};

module.exports = {
    sendZeroValueTx,
};
