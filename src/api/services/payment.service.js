'use strict'

// models 
const _Payment = require('../models/payment.model');
const _Cart = require('../models/cart.model');
const _Product = require('../models/product.model');
const _HistoryPayment = require('../models/historyPayment.model');
const _User = require('../models/user.model');
// core
const {
    BadRequestError,
    InternalServerError,
    UnauthorizedError
} = require('../core/error.res');

// get all payments
const get_all_payments = async () => {
    const payments = await _Payment.find();
    
    return {
        code: 201,
        message: "Tất cả thanh toán",
        metadata: payments
    }
};
// get all history payments
const get_all_history_payments = async () => {
    const historyPayments = await _HistoryPayment.find();
    
    return {
        code: 201,
        message: "Tất cả lịch sử thanh toán",
        metadata: historyPayments
    }
}
// get payment by id
const get_payment_by_id = async ({id, idUser}) => {
    const payments = await _Payment.findOne({_id: id});
    const user = await _User.findOne({_id: idUser});

    if (!payments) {
        return {
            code: 201,
            message: `Không có yêu cầu thanh toán`
        }
    }

    if (payments.id === idUser || user.role === "Admin") {
        return {
            code: 201,
            message: `Tất cả thanh toán của ${user.username}`,
            metadata: payments
        }
    }
    
    throw new UnauthorizedError('Bạn không có quyền truy cập')
};
// get payments by id user
const get_payments_by_id_user = async ({id}) => {
    const payments = await _Payment.find({id});
    
    return {
        code: 201,
        message: "Tất cả Thanh toán",
        metadata: payments
    }
};
// get history payments by id user
const get_history_payments_by_id_user = async ({id}) => {
    const historyPayments = await _HistoryPayment.find({id});
    
    return {
        code: 201,
        message: "Tất cả lịch sử Thanh toán",
        metadata: historyPayments
    }
}
// Customer request payment
const payment_cart = async ({id, carts}) => {
    const products = [];
    for (let idCart of carts) {
        const cart = await _Cart.findOne({_id: idCart});
        if (!cart) throw new InternalServerError();
        if (id !== cart.idUser) throw new UnauthorizedError('Bạn không có quyền truy cập')
        products.push({
            idUser: cart.idUser,
            idProduct: cart.idProduct,
            name: cart.name,
            qty: cart.qty,
            price: cart.price,
            image: cart.image
        });
    }

    await _Payment.create({id, carts: products});
    await _Cart.deleteMany({_id: {$in: carts}});

    return {
        code: 201,
        message: `Đợi xác nhận thanh toán`
    }
};
// User Cancel payment
const cancel_payment = async({id, idUser}) => {
    const payment = await _Payment.findOne({_id: id});
    if (!payment) throw new InternalServerError();

    if (payment.id !== idUser) throw new UnauthorizedError('Bạn không có quyền truy cập');

    const carts = payment.carts;

    await _Payment.deleteOne({_id: id});
    await _Cart.insertMany(carts);

    return {
        code: 201,
        message: "Hủy Thanh toán thành công"
    }
};
// admin cancel payment
const cancel_payment_by_admin = async({id}) => {
    const payment = await _Payment.findOne({_id: id});
    if (!payment) throw new InternalServerError();

    await _Payment.deleteOne({_id: id});

    return {
        code: 201,
        message: "Hủy Thanh toán thành công"
    }
}
// confirm a payment
const confirm_payment = async ({id}) => {
    const payment = await _Payment.findOne({_id: id});
    if (!payment) throw new InternalServerError();

    await _Payment.deleteOne({_id: id});

    for (let cart of payment.carts) {
        const productInInventory = await _Product.findOne({id: cart.idProduct});
        if (productInInventory.qty < cart.qty) throw new BadRequestError('Mua quá số lượng hàng hóa')
        await _Product.updateOne(
            {
                id: cart.idProduct
            }, 
            {
                $set: {
                    qty: productInInventory.qty - cart.qty
                }
            }
        );
    }

    const NewHistoryPayment = {
        id: payment.id,
        carts: payment.carts
    };

    await _HistoryPayment.create(NewHistoryPayment);

    return {
        code: 201,
        message: "Thanh toán thành công"
    }
}

// export module
module.exports = {
    get_all_payments,
    get_all_history_payments,
    get_payment_by_id,
    get_payments_by_id_user,
    get_history_payments_by_id_user,
    payment_cart,
    cancel_payment,
    cancel_payment_by_admin,
    confirm_payment
}