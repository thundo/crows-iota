'use strict';

const config = require('config');
const Crows = require('./crows');
const Iota = require('../core/iota');

console.log(config);

module.exports = async () => {
    const iota = new Iota();
    await iota.initialize();
    const provider = iota.getProvider();

    const accountData = await provider.getAccountData(config.iota.seed);
    console.log(accountData);

    const newAddress = await provider.getNewAddress(config.iota.seed);
    console.log(newAddress);

    const crows = new Crows(iota);
    await crows.register(newAddress);

    await crows.measure();
};
