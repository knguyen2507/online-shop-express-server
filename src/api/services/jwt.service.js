'use strict'

const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('../../database/init.redis');
// models
const _User = require('../models/user.model');

// create access token
const signAccessToken = async (id) => {
    return new Promise ((resolve, reject) => {
        const payload = { id };
        const secret = process.env.SECRET_ACCESS_TOKEN;
        const options = { expiresIn: '60s'};

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
                if (err) reject(createError.InternalServerError())
                resolve(token)
            })
        })
    })
};
// check role admin
const check_access_role_admin = async (id) => {
    const user = await _User.findOne({_id: id});
    if (!user) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    if (user.role !== 'Admin') {
        return {
            code: 401,
            message: "You don't have Access"
        }
    }
    return {
        code: 200,
        message: "OK"
    }
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    check_access_role_admin
};