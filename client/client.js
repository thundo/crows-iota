'use strict';

const config = require('config');
const Crows = require('../core/crows');
const Iota = require('../core/iota');

console.log(config);

module.exports = async () => {
    const iota = new Iota();
    await iota.initialize();
    const provider = iota.getProvider();
    const crows = new Crows(iota);

    await crows.register();

    const accountData = await provider.getAccountData(config.seed);
    console.log(accountData);

    console.log(await provider.getNewAddress(config.seed));

    await crows.measure();
};
