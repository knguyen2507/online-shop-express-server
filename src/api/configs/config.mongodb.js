'use strict'

const dotenv = require('dotenv');

dotenv.config();

const dev = {
    db: `mongodb://${process.env.DEV_DB_HOST}:${process.env.DEV_DB_PORT}/${process.env.DEV_DB_NAME}`
}

const pro = {
    db: `mongodb+srv://${process.env.PRO_DB_USERNAME}:${process.env.PRO_DB_PASSWORD}@home-appliance-store.xnf0ea1.mongodb.net/?retryWrites=true&w=majority`
}

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';

// export module
module.exports = config[env];