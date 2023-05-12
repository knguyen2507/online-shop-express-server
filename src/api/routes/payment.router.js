'use strict'

const express = require('express');
// controllers
const {
    getAllPayments,
    getAllHistoryPayments,
    getPaymentById,
    getPaymentsByIdUser,
    getHistoryPaymentsByIdUser,
    paymentCart,
    cancelPayment,
    cancelPaymentByAdmin,
    confirmPayment
} = require('../controllers/payment.controller');
// middlewares
const { 
    verifyAccessToken,
    authPage
} = require('../middlewares/jwt.middleware');

const router = express.Router();

router.get(
    '/admin/get-all-payments', 
    [
        verifyAccessToken, 
        authPage(['Admin'])
    ], 
    getAllPayments
);
router.get(
    '/admin/history', 
    [
        verifyAccessToken, 
        authPage(['Admin'])
    ], 
    getAllHistoryPayments
);
router.get(
    '/user/:id/get-payments-by-id', 
    [
        verifyAccessToken
    ], 
    getPaymentsByIdUser
);
router.get(
    '/user/:id/get-history-payments-by-id', 
    [
        verifyAccessToken
    ], 
    getHistoryPaymentsByIdUser
);
router.post(
    '/user/:id/send-payment', 
    [
        verifyAccessToken
    ], 
    paymentCart
);
router.delete(
    '/user/:id/cancel-payment', 
    [
        verifyAccessToken
    ], 
    cancelPayment
);
router.delete(
    '/admin/:id/cancel-payment', 
    [
        verifyAccessToken, 
        authPage(['Admin'])
    ], 
    cancelPaymentByAdmin
);
router.post(
    '/admin/:id/confirm-payment', 
    [
        verifyAccessToken, 
        authPage(['Admin'])
    ], 
    confirmPayment
);
router.get(
    '/:id', 
    [
        verifyAccessToken
    ], 
    getPaymentById
);

// export module
module.exports = router;