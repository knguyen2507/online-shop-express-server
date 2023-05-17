'use strict'

const createError = require('http-errors');
// services
const { 
    get_all_users,
    get_user_by_id,
    get_user_by_admin,
    login,
    forgot_pasword,
    password_verify_otp,
    logout,
    sign_up_guest,
    register_verify_otp,
    create_user_by_admin,
    delete_user,
    change_password
} = require('../services/user.service');

// get all users
const getAllUsers = async (req, res) => {
    const {code, metadata, message} = await get_all_users({});

    return res.status(code).json({
        code, metadata, message
    })
};
// get user by id
const getUserById = async (req, res) => {
    const id = req.params.id;
    if (id !== req.user_id) {
        return res.status(401).json({
            code: 401, message: "You don't have Access"
        })
    }; 
    const {code, metadata, message} = await get_user_by_id({id});

    return res.status(code).json({
        code, metadata, message
    })
};
// admin get user by id
const getUserByAdmin = async (req, res) => {
    const id = req.params.id;

    const {code, metadata, message} = await get_user_by_admin({id});

    return res.status(code).json({
        code, metadata, message
    })
};
// login
const logIn = async (req, res) => {
    const {username, password} = req.body;

    const {code, metadata, message} = await login({us: username, pwd: password});

    if (!metadata) {
        return res.status(code).json({
            code, metadata: metadata, message
        })
    }

    return res.status(code).json({
        code, metadata, message
    })
};
// create new password
const forgotPassword = async (req, res) => {
    const email = req.body.email;
    const { code, message, metadata } = await forgot_pasword({email});

    return res.status(code).json({
        code, message, metadata
    })
};
// password verify otp 
const passwordVerifyOtp = async (req, res) => {
    const {
        otp, password, email
    } = req.body;

    const {
        code, message
    } = await password_verify_otp({
        otp, password, email
    });

    return res.status(code).json({
        code, message
    });
};
// Log out
const logOut = async (req, res) => {
    const id = req.payload.id;
    const { code, message } = await logout({id});

    return res.status(code).json({
        code, message
    })
};
// register guest account
const signUpGuest = async (req, res) => {
    const email = req.body.email;
    const { code, message, metadata } = await sign_up_guest({email});

    return res.status(code).json({
        code, message, metadata
    })
};
// verify otp
const RegisterVerifyOtp = async (req, res) => {
    const {
        otp, name, username, password, email
    } = req.body;

    const {
        code, metadata, message
    } = await register_verify_otp({
        otp, name, username, password, email
    });

    return res.status(code).json({
        code, metadata, message
    });
};
// create user by admin rights
const createUserByAdmin = async (req, res) => {
    const {
        name, username, password, email, role
    } = req.body;
    const { 
        code, message, metadata 
    } = await create_user_by_admin({name, username, password, email, role});

    return res.status(code).json({
        code, message, metadata
    })

};
// delete user
const deleteUser = async (req, res) => {
    const id = req.params.id;

    const { code, message } = await delete_user({id});

    return res.status(code).json({
        code, message
    })
}
// change password
const changePassword = async (req, res) => {
    const id = req.params.id;
    const password = req.body.password;

    const { code, message } = await change_password({id, password});

    return res.status(code).json({
        code, message
    })
}

// export module
module.exports = {
    getAllUsers,
    getUserById,
    getUserByAdmin,
    logIn,
    forgotPassword,
    passwordVerifyOtp,
    logOut,
    signUpGuest,
    RegisterVerifyOtp,
    createUserByAdmin,
    deleteUser,
    changePassword
}