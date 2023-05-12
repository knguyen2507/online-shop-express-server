'use strict'

const dotenv = require('dotenv');

dotenv.config();

const dev = {
    db: {
        host: process.env.DEV_DB_HOST || '127.0.0.1',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'db-eCommerce-dev'
    }
}

const pro = {
    db: {
        host: process.env.PRO_DB_HOST || '127.0.0.1',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'db-eCommerce-pro'
    }
}

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';

// export module
module.exports = config[env];