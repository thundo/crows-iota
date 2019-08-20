'use strict';

const {createLogger, format, transports} = require('winston');

module.exports = (config) => {
    const formatter = format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`);

    const options = {
        transports: [],
    };

    options.transports.push(new transports.Console(Object.assign({
        format: format.combine(format.colorize(), format.simple(), format.timestamp(), formatter),
    }, config)));

    return createLogger(options);
};
