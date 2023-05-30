'use strict'

// services
const { 
    get_all_categories,
    get_product_by_category,
    get_category_by_name,
    create_category,
    delete_category 
} = require('../services/category.service');
// core
const {
    OK, CREATED
} = require('../core/success.res');

// get all categories
const getAllCategories = async (req, res) => {
    const {code, metadata, message} = await get_all_categories();

    new OK ({
        code, message, metadata
    }).send(res);
}
// get product by brand
const getProductByCategory = async (req, res) => {
    const idCategory = req.params.category
    const {code, metadata, message} = await get_product_by_category({idCategory});

    new OK ({
        code, message, metadata
    }).send(res);
};
// get category by name
const getCategoryByName = async (req, res) => {
    const id = req.params.id;
    const {code, metadata, message} = await get_category_by_name({id});

    new OK ({
        code, message, metadata
    }).send(res);
}
// create new category
const createCategory = async (req, res) => {
    const {id, name} = req.body;
    const {code, message} = await create_category({id, name});

    new CREATED ({
        code, message
    }).send(res);
};
// delete category
const deleteCategory = async (req, res) => {
    const id = req.params.id;
    const {code, message} = await delete_category({id});

    new OK ({
        code, message
    }).send(res);
};

// export module
module.exports = {
    getAllCategories,
    getProductByCategory,
    getCategoryByName,
    createCategory,
    deleteCategory
}