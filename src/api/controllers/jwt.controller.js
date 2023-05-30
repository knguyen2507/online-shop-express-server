'use strict'

const {
    signAccessToken,
    check_access_role_admin
} = require('../services/jwt.service');
// core
const {
    OK
} = require('../core/success.res');

// get new access token
const refreshToken = async (req, res) => {
    const id = req.payload.id;

    const accessToken = await signAccessToken(id);

    new OK ({
        code, accessToken
    }).send(res);
};

// export module
module.exports = {
    refreshToken
};