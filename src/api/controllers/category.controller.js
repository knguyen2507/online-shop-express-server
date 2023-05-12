'use strict'

// services
const { 
    get_all_categories,
    get_product_by_category,
    get_category_by_name,
    create_category,
    delete_category 
} = require('../services/category.service');

// get all categories
const getAllCategories = async (req, res) => {
    const {code, metadata, message} = await get_all_categories();

    return res.status(code).json({
        code, metadata, message
    });
}
// get product by brand
const getProductByCategory = async (req, res) => {
    const idCategory = req.params.category
    const {code, metadata, message} = await get_product_by_category({idCategory});

    return res.status(code).json({
        code, metadata, message
    })
};
// get category by name
const getCategoryByName = async (req, res) => {
    const id = req.params.id;
    const {code, metadata, message} = await get_category_by_name({id});

    return res.status(code).json({
        code, metadata, message
    })
}
// create new category
const createCategory = async (req, res) => {
    const {id, name} = req.body;
    const {code, message} = await create_category({id, name});

    return res.status(code).json({
        code, message
    })
};
// delete category
const deleteCategory = async (req, res) => {
    const id = req.params.id;
    const {code, message} = await delete_category({id});

    return res.status(code).json({
        code, message
    })
};

// export module
module.exports = {
    getAllCategories,
    getProductByCategory,
    getCategoryByName,
    createCategory,
    deleteCategory
}