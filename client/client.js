'use strict';

const config = require('config');
const Iota = require('../core/iota');

console.log(config);

module.exports = async () => {
    const iota = new Iota();
    await iota.initialize();
    const provider = iota.getProvider();

    const accountData = await provider.getAccountData(config.seed);
    console.log(accountData);

    console.log(await provider.getNewAddress(config.seed));

    const message = {
        temperature: 28.5,
        humidity: 63.3,
        dt: Date.now()
    };

    await iota.sendZeroValueTx(config.seed, config.serverAddress, message);
};
