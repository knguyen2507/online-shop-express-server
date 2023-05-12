'use strict'

const dotenv = require('dotenv');

dotenv.config();

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 5000
    }
}

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 5000
    }
}

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';

// export module
module.exports = config[env];