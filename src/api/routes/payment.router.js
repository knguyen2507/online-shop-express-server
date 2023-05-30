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
const {
    asyncHandler
} = require('../middlewares');

const router = express.Router();

// admin get all payments
router.get('/admin/get-all-payments', 
    [
        asyncHandler(verifyAccessToken), 
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(getAllPayments)
);
// admin get all history payments
router.get('/admin/history', 
    [
        asyncHandler(verifyAccessToken), 
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(getAllHistoryPayments)
);
// user get all payments
router.get('/user/:id/get-payments-by-id', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(getPaymentsByIdUser)
);
// user get all history payments
router.get('/user/:id/get-history-payments-by-id', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(getHistoryPaymentsByIdUser)
);
// user send payment
router.post('/user/:id/send-payment', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(paymentCart)
);
// user cancel payment
router.delete('/user/:id/cancel-payment', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(cancelPayment)
);
// admin cancel payment
router.delete('/admin/:id/cancel-payment', 
    [
        asyncHandler(verifyAccessToken), 
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(cancelPaymentByAdmin)
);
// admin confirm payment
router.post('/admin/:id/confirm-payment', 
    [
        asyncHandler(verifyAccessToken), 
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(confirmPayment)
);
// get payment by id
router.get('/:id', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(getPaymentById)
);

// export module
module.exports = router;