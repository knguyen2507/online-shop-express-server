'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema({
    idUser: {
        type: String,
        maxLength: 100
    },
    idProduct : {
        type: String,
        maxLength: 100
    },
    name: {
        type: String
    },
    qty: {
        type: Number
    },
    price: {
        type: Number
    },
    image: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now,
        index: {expires: 60*30}
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// export module
module.exports = model(DOCUMENT_NAME, cartSchema);