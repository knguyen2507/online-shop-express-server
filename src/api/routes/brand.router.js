'use strict'

const express = require('express');
const multer = require('multer');
const path = require('path');
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