'use strict'

const {
    signAccessToken,
    check_access_role_admin
} = require('../services/jwt.service');

// get new access token
const refreshToken = async (req, res) => {
    const id = req.payload.id;

    const accessToken = await signAccessToken(id);

    return res.status(200).json({
        code: 200, accessToken
    });
};

// export module
module.exports = {
    refreshToken
};