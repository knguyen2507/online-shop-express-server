'use strict'

const express = require('express');
// controllers
const { 
    getAllCategories,
    getProductByCategory,
    getCategoryByName,
    createCategory,
    deleteCategory 
} = require('../controllers/category.controller');
// middlewares
const { checkCreateBrand } = require('../middlewares/category.middleware');
const {
    verifyAccessToken,
    authPage
} = require('../middlewares/jwt.middleware');

const router = express.Router();

router.get('/get-all-categories', getAllCategories);
router.get('/:category/products', getProductByCategory);
router.post(
    '/create-category', 
    [
        checkCreateBrand,
        verifyAccessToken,
        authPage(['Admin'])
    ], 
    createCategory
);
router.delete('/delete-category/:id',
    [
        verifyAccessToken, 
        authPage(['Admin'])
    ],
    deleteCategory
);
router.get('/:id', getCategoryByName);
module.exports = router;