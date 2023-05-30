'use strict'

// models
const _Category = require('../models/category.model');
// core
const {
    BadRequestError
} = require('../core/error.res');

const checkCreateBrand = async (req, res, next) => {
    if (req.body.id === '' || req.body.name === '') {
        throw new BadRequestError('Không được để trống dữ liệu');
    }

    const {id, name} = req.body;

    const checkId = await _Category.findOne({id});
    const checkName = await _Category.findOne({name});

    if (checkId || checkName) {
        throw new BadRequestError('Danh mục sản phẩm này đã tồn tại');
    }

    next();
};

module.exports = {
    checkCreateBrand
}