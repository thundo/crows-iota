'use strict';

const createRouter = require('express-promise-router');

const router = createRouter();

router.post('/register', async (req, res) => {
    res.send("Registered!");
});

module.exports = router;
