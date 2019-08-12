'use strict';

const createRouter = require('express-promise-router');
const nanoid = require('nanoid');
const HttpStatus = require('http-status-codes');
const pick = require('lodash.pick');

module.exports = (members) => {
    const router = createRouter();

    router.post('/stations', async (req, res) => {
        const id = nanoid();
        const station = Object.assign({
            ID: id,
            updated_at: new Date(),
            created_at: new Date(),
        }, pick(req.body, ['external_id', 'name', 'latitude', 'longitude', 'altitude']));

        members[id] = station;

        res.status(HttpStatus.CREATED).send(station);
    });

    return router;
};
