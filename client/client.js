'use strict';

const config = require('config');
const Crows = require('./crows');
const Iota = require('../core/iota');
const logger = require('./logger');
const util = require('util');

module.exports = async () => {
    const iota = new Iota(config.iota.seed, config.iota.iriUri, config.iota.options, logger);
    await iota.initialize();
    const provider = iota.getProvider();

    const accountData = await provider.getAccountData(config.iota.seed);
    logger.debug(util.inspect(accountData, true, null));

    const newAddress = await iota.newAttachedAddress();

    const crows = new Crows(iota);
    await crows.register(newAddress);

    await crows.measure();
};
