'use strict'

const JWT = require("jsonwebtoken");
const createError = require('http-errors');
const client = require('../../database/init.redis');
// Models
const _User = require('../models/user.model');

// verify access token
const verifyAccessToken = async (req, res, next) => {
    // get authorization header
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return next(createError.Forbidden('You need sign in!'));
    }

    // authHeader = 'bearer' + accessToken
    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
        return next(createError.BadRequest('No token!'));
    }

    // verify access token
    JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return next(createError.Unauthorized());
            }
            return next(createError.Unauthorized(err.message));
        }

        req.user_id = decoded.id;
        next();
    });
};

const verifyRefreshToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if(!refreshToken) return createError.BadRequest();

    // verify refresh token
    JWT.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, decoded) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return next(createError.Unauthorized());
            }
            return next(createError.Unauthorized(err.message));
        }
        client.get(decoded.id, (err, reply) => {
            if (err) return next(createError.InternalServerError())
            
            if (refreshToken !== reply) {
                next(createError.Unauthorized());
            }

            req.payload = decoded;
            next();
        })
        
    });
};

const authPage = permissions => {
    return async (req, res, next) => {
        const id = req.user_id;
        const user = await _User.findOne({_id: id});
        if (!user) return next(createError.InternalServerError())
        if(!permissions.includes(user.role)) return next(createError.Unauthorized('Your account does not have access!'));
        next();
    }
};

// export module
module.exports = {
    verifyAccessToken,
    verifyRefreshToken,
    authPage
};