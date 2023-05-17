'use strict'

const bcrypt = require('bcrypt');
// models
const _Otp = require('../models/otp.model');

const insertOtp = async ({otp, email}) => {
    const hashOtp = await bcrypt.hash(otp, 10);
    const Otp = await _Otp.create({
        email, otp: hashOtp
    });

    return Otp ? 1 : 0
};

const validOtp = async ({otp, hashOtp}) => {
    const isValid = await bcrypt.compare(otp, hashOtp);
    return isValid;
};


module.exports = { 
    insertOtp, 
    validOtp
}