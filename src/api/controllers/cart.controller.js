'use strict'

// services
const {
    get_cart_by_id,
    add_product_to_cart,
    add_qty_product_in_cart,
    reduce_product_in_cart,
    remove_product_from_cart
} = require('../services/cart.service');
// core
const {
    OK
} = require('../core/success.res');

// get cart by id
const getCartById = async (req, res) => {
    const id = req.params.id;

    if (id !== req.user_id) {
        return res.status(401).json({
            code: 401, message: "You does not have access!"
        });
    }

    const {code, message, metadata} = await get_cart_by_id({id});

    new OK ({
        code, message, metadata
    }).send(res);
};
// add product to cart
const addProductToCart = async (req, res) => {
    const id = req.user_id;
    const idProduct = req.body.id;

    const {code, message} = await add_product_to_cart({id, idProduct});

    new OK ({
        code, message
    }).send(res);
};
// add qty product in cart
const addQtyProductInCart = async (req, res) => {
    const id = req.params.id;

    const {code, message} = await add_qty_product_in_cart({id, idUser: req.user_id});

    new OK ({
        code, message
    }).send(res);
};
// reduce the qty product in cart
const reduceProductInCart = async (req, res) => {
    const id = req.params.id;

    const {code, message} = await reduce_product_in_cart({id, idUser: req.user_id});

    new OK ({
        code, message
    }).send(res);
};
// remove product from cart
const removeProductFromCart = async (req, res) => {
    const id = req.params.id;

    const {code, message} = await remove_product_from_cart({id, idUser: req.user_id});

    new OK ({
        code, message
    }).send(res);
};

// export module
module.exports = {
    getCartById,
    addProductToCart,
    addQtyProductInCart,
    reduceProductInCart,
    removeProductFromCart
};