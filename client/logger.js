'use strict';

const createLogger = require('../core/createLogger');
const config = require('config');

module.exports = createLogger(config.logger);
