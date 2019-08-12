'use strict';

const createRouter = require('express-promise-router');
const nanoid = require('nanoid');
const HttpStatus = require('http-status-codes');
const pick = require('lodash.pick');
const yup = require('yup');

module.exports = (members) => {
    const router = createRouter();

    const newStationRequestValidator = yup.object().shape({
        external_id: yup.string().required(),
        name: yup.string().required(),
        latitude: yup.number().required(),
        longitude: yup.number().required(),
        altitude: yup.number().required(),
        adddress: yup.string().required(),
    });

    router.post('/stations', async (req, res) => {
        const isValid = await newStationRequestValidator.isValid(req.body);
        console.log(isValid)
        if (!isValid) {
            const e = new Error('Invalid request');
            e.code = HttpStatus.BAD_REQUEST;
            throw e;
        }

        const id = nanoid();
        const station = Object.assign({
            ID: id,
            updated_at: new Date(),
            created_at: new Date(),
        }, pick(req.body, ['external_id', 'name', 'latitude', 'longitude', 'altitude', 'address']));

        members[id] = station;

        res.status(HttpStatus.CREATED).send(station);
    });

    router.put('/stations/:id', (req, res) => {

    });

    return router;
};
