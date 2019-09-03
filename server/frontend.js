'use strict';

const createRouter = require('express-promise-router');

module.exports = () => {
    const router = createRouter();
    router.get('/', (req, res) => {
        res.render('index.html');
    });
    return router;
};
