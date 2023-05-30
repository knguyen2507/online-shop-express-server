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
const {
    asyncHandler
} = require('../middlewares');

const router = express.Router();

// get all brands
router.get('/get-all-brands', 
    asyncHandler(getAllBrands)
);
// admin create brand
router.post('/create-brand', 
    [
        upload.single('image'),
        asyncHandler(checkCreateBrand),
        asyncHandler(verifyAccessToken),
        asyncHandler(authPage(['Admin']))
    ],
    asyncHandler(createBrand)
);
// admin delete brand
router.delete('/delete-brand/:id',
    [
        asyncHandler(verifyAccessToken), 
        asyncHandler(authPage(['Admin']))
    ], 
    asyncHandler(deleteBrand)
);
// get product by brand
router.get('/:brand/products', 
    asyncHandler(getProductByBrand)
);
// get brand by name
router.get('/:id', 
    asyncHandler(getBrandByName)
);

// export module
module.exports = router;