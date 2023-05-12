'use strict'

const createError = require('http-errors');
// models
const _Product = require('../models/product.model');
const _Brand = require('../models/brand.model');
const _Category = require('../models/category.model');

const checkSearchProduct = async (req, res, next) => {
    if (req.body.key === null) {
        return next(createError.BadRequest('Search: NULL values'));
    }

    next();
};

const checkCreateProduct = async (req, res, next) => {
    if (
        req.body.id === "" ||
        req.body.name === "" ||
        req.body.qty === "" ||
        req.body.category === "" ||
        req.body.brand === "" ||
        req.body.price === ""
    ) {
        return next(createError.BadRequest('Please Fill all fields'));
    }

    console.log(`file:::`, req.file);

    const {id, name, category, brand} = req.body;

    const checkCategory = await _Category.findOne({name: category});
    const checkBrand = await _Brand.findOne({name: brand});
    const checkProductId = await _Product.findOne({id});
    const checkProductName = await _Product.findOne({name});

    if (!checkCategory) {
        return next(createError.Unauthorized("Category not exist in database!"));
    };
    if (!checkBrand) {
        return next(createError.Unauthorized("Brand not exist in database!"));
    };
    if (checkProductId || checkProductName) {
        return next(createError.Unauthorized("Product already exists!"));
    };
    if (req.file.originalname.includes('.')) {
        const extension = req.file.originalname.split('.')[1];
        if (extension !== 'jpg') {
            return next(createError.Unauthorized("only accept .jpg file!"));
        }
    } else {
        return next(createError.Unauthorized("You uploaded invalid file!"));
    }

    next();
};

// export module
module.exports = {
    checkSearchProduct,
    checkCreateProduct
}