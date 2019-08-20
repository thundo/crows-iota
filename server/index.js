'use strict';

const logger = require('./logger');
const Server = require('./server');

const server = new Server();

const dispose = () => {
    logger.info('Shutting down...');
    server.dispose();
};

process
    .once('SIGINT', dispose)
    .on('uncaughtException', (err) => {
        logger.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });

server.start();
