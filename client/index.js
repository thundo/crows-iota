'use strict';

const logger = require('./logger');
const Client = require('./client');

const client = new Client();

const dispose = () => {
    logger.info('Shutting down...');
    client.dispose();
};

process
    .once('SIGINT', dispose)
    .on('uncaughtException', (err) => {
        logger.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });

client.start();
