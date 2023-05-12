'use strict'

const createError = require('http-errors');
// models
const _Brand = require('../models/brand.model');

const checkCreateBrand = async (req, res, next) => {
    if (req.body.id === '' || req.body.name === '') {
        return next(createError.BadRequest('Please Fill all fields'));
    }

    if (req.file.originalname.includes('.')) {
        const extension = req.file.originalname.split('.')[1];
        if (extension !== 'jpg') {
            return next(createError.Unauthorized("only accept .jpg file!"));
        }
    } else {
        return next(createError.Unauthorized("You uploaded invalid file!"));
    }

    const {id, name} = req.body;

    const checkId = await _Brand.findOne({id});
    const checkName = await _Brand.findOne({name});

    if (checkId || checkName) {
        return next(createError.Unauthorized("Brand already exists!"));
    }

    next();
};

module.exports = {
    checkCreateBrand
}