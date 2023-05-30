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
const {
    asyncHandler
} = require('../middlewares');

const router = express.Router();

// get all categories
router.get('/get-all-categories', 
    asyncHandler(getAllCategories)
);
// get products by category
router.get('/:category/products', 
    asyncHandler(getProductByCategory)
);
// create new category
router.post('/create-category', 
    [
        asyncHandler(checkCreateBrand),
        asyncHandler(verifyAccessToken),
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(createCategory)
);
// delete category
router.delete('/delete-category/:id',
    [
        asyncHandler(verifyAccessToken), 
        asyncHandler(authPage(['Admin']))
    ],
    asyncHandler(deleteCategory)
);
// get category by name
router.get('/:id', 
    asyncHandler(getCategoryByName)
);

// export module
module.exports = router;