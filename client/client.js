'use strict';

const config = require('config');
const {getProvider, sendZeroValueTx} = require('../core/utils');

console.log(config);

module.exports = async () => {
    const iota = await getProvider();

    const accountData = await iota.getAccountData(config.seed);
    console.log(accountData);

    console.log(await iota.getNewAddress(config.seed));

    const message = {
        temperature: 28.5,
        humidity: 63.3,
        dt: Date.now()
    };

    await sendZeroValueTx(iota, config.seed, config.serverAddress, message);
};
