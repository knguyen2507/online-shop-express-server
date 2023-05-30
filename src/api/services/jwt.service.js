'use strict'

const JWT = require('jsonwebtoken');
const client = require('../../database/init.redis');
// core
const {
    InternalServerError
} = require('../core/error.res');

// create access token
const signAccessToken = async (id) => {
    return new Promise ((resolve, reject) => {
        const payload = { id };
        const secret = process.env.SECRET_ACCESS_TOKEN;
        const options = { expiresIn: '1d'};

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
};
// create refresh token
const signRefreshToken = async (id) => {
    return new Promise ((resolve, reject) => {
        const payload = { id };
        const secret = process.env.SECRET_REFRESH_TOKEN;
        const options = { expiresIn: '1y'};

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)

            client.set(payload.id.toString(), token, 'EX', 365*24*60*60, (err, reply) => {
                if (err) reject(new InternalServerError())
                resolve(token)
            })
        })
    })
};

module.exports = {
    signAccessToken,
    signRefreshToken
};