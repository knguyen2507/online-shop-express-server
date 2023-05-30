'use strict'

const JWT = require("jsonwebtoken");
const client = require('../../database/init.redis');
// Models
const _User = require('../models/user.model');
// core
const {
    BadRequestError,
    ForbiddenRequestError,
    UnauthorizedError,
    InternalServerError
} = require('../core/error.res');

// verify access token
const verifyAccessToken = async (req, res, next) => {
    // get authorization header
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        throw new ForbiddenRequestError('Chưa đăng nhập');
    }

    // authHeader = 'bearer' + accessToken
    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
        throw new BadRequestError('Không có token');
    }

    // verify access token
    JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                throw new UnauthorizedError();
            }
            throw new UnauthorizedError(err.message);
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
                throw new UnauthorizedError();
            }
            throw new UnauthorizedError(err.message);
        }
        client.get(decoded.id, (err, reply) => {
            if (err) throw new InternalServerError();
            
            if (refreshToken !== reply) {
                throw new UnauthorizedError();
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
        if (!user) throw new InternalServerError();
        if(!permissions.includes(user.role)) throw new UnauthorizedError('Tài khoản của bạn không có quyền truy cập');
        next();
    }
};

// export module
module.exports = {
    verifyAccessToken,
    verifyRefreshToken,
    authPage
};