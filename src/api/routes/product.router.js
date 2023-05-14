'use strict'

const express = require('express');
const multer = require('multer');
const path = require('path');
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

console.log(`dirname product:::`, __dirname);

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../public/'));
    },
    filename: (req, file, cb) => {
        cb(null, `uploads/products/${file.originalname}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[1] === 'jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Not a JPG File!!!'), false)
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

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