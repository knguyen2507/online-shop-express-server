'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    qty: {
        type: Number
    },
    idCategory: {
        type: String
    },
    category: {
        type: String
    },
    brand: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String
    },
    firebase: {
        type: String
    },
    details: []
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// export module
module.exports = model(DOCUMENT_NAME, productSchema);