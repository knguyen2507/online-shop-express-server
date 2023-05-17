'use strict'

const createError = require('http-errors');
const bcrypt = require('bcrypt');
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
// check new password
const checkNewPassword = async (req, res, next) => {
    const email = req.body.email;
    const user = await _User.findOne({ email });

    // check user avaiable
    if (!user) {
        return next(createError.BadRequest('This email does not exist!'));
    }
    if (req.body.password === "" || req.body.email === "" || req.body.re_password === "") {
        return next(createError.BadRequest('Please Fill all fields'));
    }
    if (req.body.password !== req.body.re_password) {
        return next(createError.BadRequest('Incorrect password'));
    }

    next();
};
// check change password
const checkChangePassword = async (req, res, next) => {
    const id = req.params.id;
    const user = await _User.findOne({ _id: id });

    // check user avaiable
    if (!user) {
        return next(createError.BadRequest('This user does not exist!'));
    }

    if (req.body.password === "" || req.body.re_password === "" || req.body.cur_password === "") {
        return next(createError.BadRequest('Please Fill all fields'));
    }
    if (req.body.password !== req.body.re_password) {
        return next(createError.BadRequest('Incorrect password'));
    }
    if (req.body.password === req.body.cur_password) {
        return next(createError.BadRequest('New password cannot be the same as your old password'));
    }

    const isValid = await bcrypt.compare(req.body.cur_password, user.password);

    if (!isValid) {
        return next(createError.BadRequest('Incorrect password'));
    }

    next();
};

// export module
module.exports = {
    checkLogin,
    checkRegister,
    checkNewPassword,
    checkChangePassword
}