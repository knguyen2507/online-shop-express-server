'use strict'

const { createClient } = require('redis');
const config = require('../api/configs/config.redis');

const REDIS_URI = config.uri;

const client= createClient({
    url: REDIS_URI
});

client.ping(function (err, result) {
    console.log(result);
});

client.on("error", (error) => {
    console.error(error);
});

client.on('connect', (error) => {
    console.log('Redis client connected');
});

client.on("ready", (error) => {
    console.error('Redis to ready');
});

// export module
module.exports = client;