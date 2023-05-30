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
const {
    asyncHandler
} = require('../middlewares');

const router = express.Router();

// get all products
router.get('/get-all-products', 
    asyncHandler(getAllProducts)
);
// admin create product
router.post('/create-product', 
    [
        upload.single('image'), 
        asyncHandler(checkCreateProduct), 
        asyncHandler(verifyAccessToken), 
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(createProduct)
);
// admin update product
router.patch('/update-product/:id', 
    [
        asyncHandler(verifyAccessToken), 
        asyncHandler(authPage(['Admin']))
    ],
    asyncHandler(updateProduct)
);
// admin delete product
router.delete('/delete-product/:id',
    [
        asyncHandler(verifyAccessToken), 
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(deleteProduct)
);
// find product
router.post('/search', 
    [
        asyncHandler(checkSearchProduct)
    ], 
    asyncHandler(searchProduct)
);
// get product by id
router.get('/:id', 
    asyncHandler(getProductById)
);

// export module
module.exports = router;