'use strict'

const { Schema, model } = require('mongoose');

const COLLECTION_NAME = 'BlackList';
const DOCUMENT_NAME = 'BlackLists';

var blackListSchema = new Schema({
    email: String,
    time: { type: Date, default: Date.now, index: {expires: 7*24*60*60}}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, blackListSchema);