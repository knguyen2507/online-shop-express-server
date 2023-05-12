'use strict'

const createError = require('http-errors');
// models
const _User = require('../models/user.model');

// check signin
const checkLogin = async (req, res, next) => {
    if (req.body.username === "" || req.body.password === "") {
        return next(createError.BadRequest('Please Fill all fields'));
    }

    next();
};
// check signup
const checkRegister = async (req, res, next) => {
    if (req.body.username === "" || req.body.password === "" || req.body.email === "" || req.body.name === "") {
        return next(createError.BadRequest('Please Fill all fields'));
    }
    if (req.body.password !== req.body.re_password) {
        return next(createError.BadRequest('Incorrect password'));
    }

    const username = req.body.username;
    const email = req.body.email;
    const getUserByUsername = await _User.findOne({ username });
    const getUserByEmail = await _User.findOne({ email });

    // check username avaiable
    if (getUserByUsername) {
        return next(createError.BadRequest('This username is used!'));
    }

    // check email avaiable
    if (getUserByEmail) {
        return next(createError.BadRequest('This email is used!'));
    }

    next();
};

// export module
module.exports = {
    checkLogin,
    checkRegister
}