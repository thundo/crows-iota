'use strict';

const logger = require('./logger');
const {PAYER_RUNNING, PAYER_PAYMENT_SUCCESS, PAYER_PAYMENT_FAILED, DLT_MEASUREMENT, API_STATION_REGISTERED} = require('../core/constants');

module.exports = async (ws, req, app, dlt, payer, iota) => {
    let isAlive = true;
    ws.on('pong', () => {
        logger.silly(`Websocket PONG received from ${req.connection.remoteAddress}`);
        isAlive = true;
    });
    const interval = setInterval(() => {
        if (!isAlive) {
            logger.verbose(`No WebSocket PONG received from ${req.connection.remoteAddress}, closing...`);
            return ws.terminate();
        }
        isAlive = false;
        logger.silly(`WebSocket PING to ${req.connection.remoteAddress}...`);
        ws.ping(() => {});
    }, 30000);
    ws.on('close', () => {
        logger.silly(`WebSocket from ${req.connection.remoteAddress} closed`);
        clearInterval(interval);
        payer.off(PAYER_RUNNING, payerRunningHandler);
        payer.off(PAYER_PAYMENT_SUCCESS, payerPaymentHandler);
        payer.off(PAYER_PAYMENT_FAILED, payerPaymentHandler);
        dlt.off(DLT_MEASUREMENT, dltMeasurementHandler);
        app.off(API_STATION_REGISTERED, apiStationRegisteredHandler);
    });

    logger.verbose(`WebSocket connected from ${req.connection.remoteAddress}`);
    ws.send(JSON.stringify({source: 'server', payload: {address: await iota.generateAddress(0)}}));

    function payerRunningHandler(data) {
        ws.send(JSON.stringify({source: 'payer', payload: {created_at: Date.now()}}));
    }

    function payerPaymentHandler(data) {
        ws.send(JSON.stringify({source: 'payer', payload: data}));
    }

    function dltMeasurementHandler(data) {
        ws.send(JSON.stringify({source: 'dlt', payload: data}));
    }

    function apiStationRegisteredHandler(data) {
        ws.send(JSON.stringify({source: 'api', payload: data}));
    }

    payer.on(PAYER_RUNNING, payerRunningHandler);
    payer.on(PAYER_PAYMENT_SUCCESS, payerPaymentHandler);
    payer.on(PAYER_PAYMENT_FAILED, payerPaymentHandler);
    dlt.on(DLT_MEASUREMENT, dltMeasurementHandler);
    app.on(API_STATION_REGISTERED, apiStationRegisteredHandler);
};
