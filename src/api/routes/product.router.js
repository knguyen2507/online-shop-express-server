'use strict'

const express = require('express');
const { upload } = require('../configs/config.storedFile');
// controllers
const { 
    getAllProducts,
    getProductById,
    searchProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');
// middlewares
const {
    checkSearchProduct,
    checkCreateProduct
} = require('../middlewares/product.middleware');
const {
    verifyAccessToken,
    authPage
} = require('../middlewares/jwt.middleware');

const router = express.Router();



router.get('/get-all-products', getAllProducts);
router.post('/create-product', 
    [
        upload.single('image'), 
        checkCreateProduct, 
        verifyAccessToken, 
        authPage(['Admin'])
    ], 
    createProduct
);
router.patch(
    '/update-product/:id', 
    [
        verifyAccessToken, 
        authPage(['Admin'])
    ],
    updateProduct
);
router.delete(
    '/delete-product/:id',
    [
        verifyAccessToken, 
        authPage(['Admin'])
    ], 
    deleteProduct
);
router.post('/search', [checkSearchProduct], searchProduct);
router.get('/:id', getProductById);

// export module
module.exports = router;