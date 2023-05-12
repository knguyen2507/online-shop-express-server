'use strict'

const express = require('express');
// controllers
const { 
    getAllUsers,
    getUserById,
    getUserByAdmin,
    logIn,
    logOut,
    signUpGuest,
    createUserByAdmin,
    deleteUser 
} = require('../controllers/user.controller');
const {
    refreshToken,
    checkAccessRoleAdmin
} =require('../controllers/jwt.controller');
// middlewares
const {
    checkLogin,
    checkRegister
} = require('../middlewares/user.middleware');
const { 
    verifyAccessToken,
    verifyRefreshToken,
    authPage
} = require('../middlewares/jwt.middleware');

const router = express.Router();

router.get('/get-all-users', [verifyAccessToken, authPage(['Admin'])], getAllUsers);
router.post('/login', [checkLogin], logIn);
router.post('/refresh-token', [verifyRefreshToken], refreshToken);
router.delete('/logout', [verifyRefreshToken], logOut);
router.post('/register', [checkRegister], signUpGuest);
router.post('/check-access-admin-page', [verifyAccessToken], checkAccessRoleAdmin);
router.post(
    '/admin/create-user', 
    [
        checkRegister,
        verifyAccessToken,
        authPage(['Admin'])
    ], 
    createUserByAdmin
);
router.delete(
    '/admin/delete-user/:id', 
    [
        verifyAccessToken,
        authPage(['Admin'])
    ], 
    deleteUser
);
router.get(
    '/admin/get-user-by-id/:id', 
    [
        verifyAccessToken,
        authPage(['Admin'])
    ], 
    getUserByAdmin
);
router.get('/:id', [verifyAccessToken], getUserById);

// export module
module.exports = router;