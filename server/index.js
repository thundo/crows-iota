'use strict';

const Server = require('./server');

const server = new Server();

const dispose = () => {
    console.log('Shutting down...');
    server.dispose();
};

process
    .once('SIGINT', dispose)
    .on('uncaughtException', (err) => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });

server.start();
