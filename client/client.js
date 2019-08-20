'use strict';

const config = require('config');
const Crows = require('./crows');
const Iota = require('../core/iota');
const logger = require('./logger');
const util = require('util');

class Client {
    constructor () {
        this.iota = new Iota(config.iota.seed, config.iota.iriUri, config.iota.options, logger);
    }

    async start () {
        await this.iota.initialize();
        const provider = this.iota.getProvider();

        const accountData = await provider.getAccountData(config.iota.seed);
        logger.debug(util.inspect(accountData, true, 2));

        const newAddress = await this.iota.newAttachedAddress();

        this.crows = new Crows(this.iota);
        await this.crows.register(newAddress);

        await this.crows.runLoop();
    }

    dispose () {
        if (this.crows !== undefined) {
            this.crows.dispose();
        }
    }
}

module.exports = Client;
