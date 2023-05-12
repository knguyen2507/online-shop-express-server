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

// check access token 
const checkAccessRoleAdmin = async (req, res) => {
    if (req.body.id !== req.user_id) {
        return res.status(401).json({
            code: 401, message: "You don't have Access"
        })
    };
    const id = req.user_id;
    const {code, message} = await check_access_role_admin(id);

    return res.status(code).json({
        code, message
    })
};

// export module
module.exports = {
    refreshToken,
    checkAccessRoleAdmin
};