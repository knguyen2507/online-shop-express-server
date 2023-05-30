'use strict'

const express = require('express');
// controllers
const { 
    getAllUsers,
    getUserById,
    getUserByAdmin,
    logIn,
    forgotPassword,
    passwordVerifyOtp,
    logOut,
    signUpGuest,
    createUserByAdmin,
    deleteUser,
    RegisterVerifyOtp,
    changePassword 
} = require('../controllers/user.controller');
const {
    refreshToken
} =require('../controllers/jwt.controller');
// middlewares
const {
    checkLogin,
    checkRegister,
    checkNewPassword,
    checkChangePassword
} = require('../middlewares/user.middleware');
const { 
    verifyAccessToken,
    verifyRefreshToken,
    authPage
} = require('../middlewares/jwt.middleware');
const {
    asyncHandler
} = require('../middlewares');

const router = express.Router();
// get all users
router.get('/get-all-users', 
    [
        asyncHandler(verifyAccessToken), 
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(getAllUsers)
);
// login
router.post('/login', 
    [
        asyncHandler(checkLogin)
    ], 
    asyncHandler(logIn)
);
// change password
router.post('/change-password/:id', 
    [
        asyncHandler(checkChangePassword), 
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(changePassword)
);
// forgot password
router.post('/forgot-password', 
    [
        asyncHandler(checkNewPassword)
    ], 
    asyncHandler(forgotPassword)
);
// verify otp forgot password
router.post('/forgot-password/verify-otp', 
    asyncHandler(passwordVerifyOtp)
);
// get new access token by refresh token
router.post('/refresh-token', 
    [
        asyncHandler(verifyRefreshToken)
    ], 
    asyncHandler(refreshToken)
);
// logout
router.delete('/logout', 
    [
        asyncHandler(verifyRefreshToken)
    ], 
    asyncHandler(logOut)
);
// signup
router.post('/register', 
    [
        asyncHandler(checkRegister)
    ], 
    asyncHandler(signUpGuest)
);
// verify otp signup
router.post('/register/verify-otp', 
    asyncHandler(RegisterVerifyOtp)
);
// admin create new user
router.post('/admin/create-user', 
    [
        asyncHandler(checkRegister),
        asyncHandler(verifyAccessToken),
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(createUserByAdmin)
);
// admin delete user
router.delete('/admin/delete-user/:id', 
    [
        asyncHandler(verifyAccessToken),
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(deleteUser)
);
// admin get user info
router.get('/admin/get-user-by-id/:id', 
    [
        asyncHandler(verifyAccessToken),
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(getUserByAdmin)
);
// get user by id
router.get('/:id', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(getUserById)
);

// export module
module.exports = router;