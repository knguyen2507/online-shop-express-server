'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Brand';
const COLLECTION_NAME = 'Brands';

const brandSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    image: {
        type: String
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// export module
module.exports = model(DOCUMENT_NAME, brandSchema);