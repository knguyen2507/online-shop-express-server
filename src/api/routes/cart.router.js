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
const {
    asyncHandler
} = require('../middlewares');

const router = express.Router();

// add product to cart
router.post('/add-product-to-cart', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(addProductToCart)
);
// add qty product in cart
router.patch('/:id/add-qty-product-from-cart', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(addQtyProductInCart)
);
// reduce qty product in cart
router.patch('/:id/reduce-product-from-cart', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(reduceProductInCart)
);
// delete product from cart
router.delete('/:id/remove-product-from-cart', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(removeProductFromCart)
);
// get cart by userId
router.get('/:id', 
    [
        asyncHandler(verifyAccessToken)
    ], 
    asyncHandler(getCartById)
);

// export module
module.exports = router;