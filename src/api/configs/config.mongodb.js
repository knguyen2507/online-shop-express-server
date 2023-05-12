'use strict'

const dotenv = require('dotenv');

dotenv.config();

const dev = {
    db: process.env.DEV_DB || process.env.DB
}

const pro = {
    db: process.env.PRO_DB || process.env.DB
}

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';

// export module
module.exports = config[env];