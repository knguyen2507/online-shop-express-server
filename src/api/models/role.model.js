'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

const roleSchema = new Schema({
    name: {
        type: String
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// export module
module.exports = model(DOCUMENT_NAME, roleSchema);