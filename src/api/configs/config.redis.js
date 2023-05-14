'use strict'

const dotenv = require('dotenv');

dotenv.config();

const dev = {
    uri: process.env.DEV_REDIS_URI
}

const pro = {
    uri: process.env.PRO_REDIS_URI
}

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';

// export module
module.exports = config[env];