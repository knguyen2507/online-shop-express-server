'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'HistoryPayment';
const COLLECTION_NAME = 'HistoryPayments';

const historyPaymentSchema = new Schema({
    id: {
        type: String,
        maxLength: 100
    },
    carts: []
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// export module
module.exports = model(DOCUMENT_NAME, historyPaymentSchema);