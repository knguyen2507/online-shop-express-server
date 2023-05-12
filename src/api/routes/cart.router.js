'use strict'

const express = require('express');
// controllers
const {
    getCartById,
    addProductToCart,
    addQtyProductInCart,
    reduceProductInCart,
    removeProductFromCart
} = require('../controllers/cart.controller');
// middlewares
const { 
    verifyAccessToken
} = require('../middlewares/jwt.middleware');

const router = express.Router();

router.post(
    '/add-product-to-cart', 
    [
        verifyAccessToken
    ], 
    addProductToCart
);
router.patch(
    '/:id/add-qty-product-from-cart', 
    [
        verifyAccessToken
    ], 
    addQtyProductInCart
);
router.patch(
    '/:id/reduce-product-from-cart', 
    [
        verifyAccessToken
    ], 
    reduceProductInCart
);
router.delete(
    '/:id/remove-product-from-cart', 
    [
        verifyAccessToken
    ], 
    removeProductFromCart
);
router.get(
    '/:id', 
    [
        verifyAccessToken
    ], 
    getCartById
);

// export module
module.exports = router;