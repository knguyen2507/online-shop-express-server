'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'Categories';

const categorySchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// export module
module.exports = model(DOCUMENT_NAME, categorySchema);