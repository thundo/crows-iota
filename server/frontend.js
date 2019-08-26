'use strict';

const createRouter = require('express-promise-router');
const logger = require('./logger');

module.exports = () => {
    const router = createRouter();
    router.get('/', (req, res) => {
        res.render('index.html');
    });
    return router;
};