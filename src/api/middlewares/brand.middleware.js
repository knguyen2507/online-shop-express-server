'use strict'

// models
const _Brand = require('../models/brand.model');
// core
const {
    BadRequestError
} = require('../core/error.res');

const checkCreateBrand = async (req, res, next) => {
    if (req.body.id === '' || req.body.name === '') {
        throw new BadRequestError('Không được để trống dữ liệu');
    }

    if (req.file.originalname.includes('.')) {
        const extension = req.file.originalname.split('.')[1];
        if (extension !== 'jpg') {
            throw new BadRequestError('Chỉ cho phép file .jpg');
        }
    } else {
        throw new BadRequestError('File ảnh không hợp lệ');
    }

    const {id, name} = req.body;

    const checkId = await _Brand.findOne({id});
    const checkName = await _Brand.findOne({name});

    if (checkId || checkName) {
        throw new BadRequestError('Nhãn hàng này đã tồn tại');
    }

    next();
};

module.exports = {
    checkCreateBrand
}