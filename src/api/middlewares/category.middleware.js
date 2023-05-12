'use strict'

const createError = require('http-errors');
// models
const _Category = require('../models/category.model');

const checkCreateBrand = async (req, res, next) => {
    if (req.body.id === '' || req.body.name === '') {
        return next(createError.BadRequest('Please Fill all fields'));
    }

    const {id, name} = req.body;

    const checkId = await _Category.findOne({id});
    const checkName = await _Category.findOne({name});

    if (checkId || checkName) {
        return next(createError.Unauthorized("Category already exists!"));
    }

    next();
};

module.exports = {
    checkCreateBrand
}