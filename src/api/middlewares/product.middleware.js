'use strict'

// models
const _Product = require('../models/product.model');
const _Brand = require('../models/brand.model');
const _Category = require('../models/category.model');
// core
const {
    BadRequestError
} = require('../core/error.res');

const checkSearchProduct = async (req, res, next) => {
    if (req.body.key === null) {
        throw new BadRequestError("Tìm kiếm: Chưa nhập nội dung");
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
        throw new BadRequestError('Không được để trống dữ liệu');
    }

    console.log(`file:::`, req.file);

    const {id, name, category, brand} = req.body;

    const checkCategory = await _Category.findOne({name: category});
    const checkBrand = await _Brand.findOne({name: brand});
    const checkProductId = await _Product.findOne({id});
    const checkProductName = await _Product.findOne({name});

    if (!checkCategory) {
        throw new BadRequestError(`Danh mục hàng hóa ${category} không tồn tại`);
    };
    if (!checkBrand) {
        throw new BadRequestError(`Nhãn hàng ${brand} không tồn tại`);
    };
    if (checkProductId || checkProductName) {
        throw new BadRequestError('Mặt hàng này đã có');
    };
    if (req.file.originalname.includes('.')) {
        const extension = req.file.originalname.split('.')[1];
        if (extension !== 'jpg') {
            throw new BadRequestError('Chỉ cho phép file .jpg');
        }
    } else {
        throw new BadRequestError('File ảnh không hợp lệ');
    }

    next();
};

// export module
module.exports = {
    checkSearchProduct,
    checkCreateProduct
}