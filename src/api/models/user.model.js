'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new Schema({
    name: {
        type: String,
        maxLength: 100
    },
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// export module
module.exports = model(DOCUMENT_NAME, userSchema);