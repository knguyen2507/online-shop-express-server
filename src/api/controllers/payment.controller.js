'use strict'

// services
const {
    get_all_payments,
    get_all_history_payments,
    get_payment_by_id,
    get_payments_by_id_user,
    get_history_payments_by_id_user,
    payment_cart,
    cancel_payment,
    cancel_payment_by_admin,
    confirm_payment
} = require('../services/payment.service');
// core
const {
    OK
} = require('../core/success.res');
const {
    UnauthorizedError
} = require('../core/error.res');

// get all payments
const getAllPayments = async (req, res) => {
    const {code, metadata, message} = await get_all_payments({});
    
    new OK ({
        code, message, metadata
    }).send(res);
};
// get all history payments
const getAllHistoryPayments = async (req, res) => {
    const {code, metadata, message} = await get_all_history_payments({});
    
    new OK ({
        code, message, metadata
    }).send(res);
};
// get payment by id
const getPaymentById = async (req, res) => {
    const id = req.params.id;

    const {code, metadata, message} = await get_payment_by_id({id, idUser: req.user_id});
    
    new OK ({
        code, message, metadata
    }).send(res);
};
// get payments by id user
const getPaymentsByIdUser = async (req, res) => {
    const id = req.params.id;

    if (id !== req.user_id) throw new UnauthorizedError('Không có quyền truy cập');

    const {code, metadata, message} = await get_payments_by_id_user({id});
    
    new OK ({
        code, message, metadata
    }).send(res);
};
// get history payments by id user
const getHistoryPaymentsByIdUser = async (req, res) => {
    const id = req.params.id;

    if (id !== req.user_id) throw new UnauthorizedError('Không có quyền truy cập');

    const {code, metadata, message} = await get_history_payments_by_id_user({id});
    
    new OK ({
        code, message, metadata
    }).send(res);
};
// customer request payment
const paymentCart = async (req, res) => {
    const id = req.params.id;
    const carts = req.body.carts;

    if (id !== req.user_id) throw new UnauthorizedError('Không có quyền truy cập')

    const {code, message} = await payment_cart({id, carts});

    new OK ({
        code, message
    }).send(res);
};
// customer cancel payment
const cancelPayment = async (req, res) => {
    const id = req.params.id;

    const {code, message} = await cancel_payment({id, idUser: req.user_id});

    new OK ({
        code, message
    }).send(res);
};
// admin cancel payment
const cancelPaymentByAdmin = async (req, res) => {
    const id = req.params.id;

    const {code, message} = await cancel_payment_by_admin({id: id});

    new OK ({
        code, message
    }).send(res);
};
// confirm a payment
const confirmPayment = async (req, res) => {
    const id = req.params.id;

    const {code, message} = await confirm_payment({id});

    new OK ({
        code, message
    }).send(res);
};

// export module
module.exports = {
    getAllPayments,
    getAllHistoryPayments,
    getPaymentById,
    getPaymentsByIdUser,
    getHistoryPaymentsByIdUser,
    paymentCart,
    cancelPayment,
    cancelPaymentByAdmin,
    confirmPayment
};