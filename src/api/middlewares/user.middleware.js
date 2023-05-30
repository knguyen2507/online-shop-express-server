'use strict'

const bcrypt = require('bcrypt');
// models
const _User = require('../models/user.model');
// core
const {
    BadRequestError
} = require('../core/error.res');

// check signin
const checkLogin = async (req, res, next) => {
    if (req.body.username === "" || req.body.password === "") {
        throw new BadRequestError('Không được để trống dữ liệu');
    }

    next();
};
// check signup
const checkRegister = async (req, res, next) => {
    if (req.body.username === "" || req.body.password === "" || req.body.email === "" || req.body.name === "") {
        throw new BadRequestError('Không được để trống dữ liệu');
    }
    if (req.body.password !== req.body.re_password) {
        throw new BadRequestError('Mật khẩu không trùng khớp');
    }

    const username = req.body.username;
    const email = req.body.email;
    const getUserByUsername = await _User.findOne({ username });
    const getUserByEmail = await _User.findOne({ email });

    // check username avaiable
    if (getUserByUsername) {
        throw new BadRequestError('Tài khoản đã được sử dụng');
    }

    // check email avaiable
    if (getUserByEmail) {
        throw new BadRequestError('Email đã được sử dụng');
    }

    next();
};
// check new password
const checkNewPassword = async (req, res, next) => {
    const email = req.body.email;
    const user = await _User.findOne({ email });

    // check user avaiable
    if (!user) {
        throw new BadRequestError('Email không tồn tại');
    }
    if (req.body.password === "" || req.body.email === "" || req.body.re_password === "") {
        throw new BadRequestError('Không được để trống dữ liệu');
    }
    if (req.body.password !== req.body.re_password) {
        throw new BadRequestError('Mật khẩu không trùng khớp');
    }

    next();
};
// check change password
const checkChangePassword = async (req, res, next) => {
    const id = req.params.id;
    const user = await _User.findOne({ _id: id });

    // check user avaiable
    if (!user) {
        throw new BadRequestError(`Không tồn tại user có id: ${id}`);
    }

    if (req.body.password === "" || req.body.re_password === "" || req.body.cur_password === "") {
        throw new BadRequestError('Không được để trống dữ liệu');
    }
    if (req.body.password !== req.body.re_password) {
        throw new BadRequestError('Mật khẩu không trùng khớp');
    }
    if (req.body.password === req.body.cur_password) {
        throw new BadRequestError('Mật khẩu mới giống mật khẩu cũ');
    }

    const isValid = await bcrypt.compare(req.body.cur_password, user.password);

    if (!isValid) {
        throw new BadRequestError('Mật khẩu cũ không chính xác');
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