'use strict'

const express = require('express');
const { upload } = require('../configs/config.storedFile');
// controllers
const { 
    getAllBrands,
    getProductByBrand,
    getBrandByName,
    createBrand,
    deleteBrand 
} = require('../controllers/brand.controller');
// middlewares
const {
    checkCreateBrand
} = require('../middlewares/brand.middleware');
const {
    verifyAccessToken,
    authPage
} = require('../middlewares/jwt.middleware');

const router = express.Router();

router.get('/get-all-brands', getAllBrands);
router.post('/create-brand', 
    [
        upload.single('image'),
        checkCreateBrand,
        verifyAccessToken,
        authPage(['Admin'])
    ],
    createBrand
);
router.delete(
    '/delete-brand/:id',
    [
        verifyAccessToken, 
        authPage(['Admin'])
    ], 
    deleteBrand
);
router.get('/:brand/products', getProductByBrand);
router.get('/:id', getBrandByName);

// export module
module.exports = router;