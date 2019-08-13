'use strict';

const createRouter = require('express-promise-router');
const nanoid = require('nanoid');
const HttpStatus = require('http-status-codes');
const pick = require('lodash.pick');
const yup = require('yup');

module.exports = (members) => {
    const router = createRouter();

    router.post('/stations', async (req, res) => {
        const newStationRequestValidator = yup.object().shape({
            external_id: yup.string().required(),
            name: yup.string().required(),
            latitude: yup.number().required(),
            longitude: yup.number().required(),
            altitude: yup.number().required(),
            payment_address: yup.string().required(),
        });

        try {
            await newStationRequestValidator.validate(req.body);
        }
        catch (e) {
            let err = new Error(e.errors);
            err.code = HttpStatus.BAD_REQUEST;
            throw err;
        }

        const id = nanoid();
        const station = Object.assign({
            station_id: id,
            updated_at: new Date(),
            created_at: new Date(),
        }, pick(req.body, ['external_id', 'name', 'latitude', 'longitude', 'altitude', 'payment_address']));

        members[id] = station;

        res.status(HttpStatus.CREATED).send(station);
    });

    router.put('/stations/:id', async (req, res) => {
        const editStationRequestValidator = yup.object().shape({
            current_address: yup.string().required(),
            payment_address: yup.string().required(),
        });

        try {
            await editStationRequestValidator.validate(req.body);
        }
        catch (e) {
            let err = new Error(e.errors);
            err.code = HttpStatus.BAD_REQUEST;
            throw err;
        }

        if (!members[req.params.id] ||
            members[req.params.id].payment_address !== req.body.current_address
        ) {
            let err = new Error('Missing station');
            err.code = HttpStatus.NOT_FOUND;
            throw err;
        }
        members[req.params.id].payment_address = req.body.payment_address;

        res.status(HttpStatus.NO_CONTENT).end()
    });

    return router;
};
