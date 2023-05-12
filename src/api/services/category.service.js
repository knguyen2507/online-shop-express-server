'use strict'

// models
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');

// get all categories
const get_all_categories = async () => {
    const categories = await _Category.find({});
    if (!categories) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    return {
        code: 200,
        metadata: {
            categories
        }
    }
};
// get product by category
const get_product_by_category = async ({idCategory}) => {
    const products = await _Product.find({idCategory: idCategory});
    if (products.length === 0) {
        return {
            code: 401,
            message: "Category not exist in database!"
        }
    }
    return {
        code: 200,
        metadata: {
            products
        }
    }
};
// get category by name 
const get_category_by_name = async ({id}) => {
    const category = await _Category.findOne({id});
    if (!category) {
        return {
            code: 401,
            message: "Category not exist in database!"
        }
    }
    return {
        code: 200,
        metadata: {
            category
        }
    }
};
// create new category
const create_category = async ({id, name}) => {
    const newCategory = {id, name};

    const category = await _Category.create(newCategory);

    return {
        code: 201,
        message: "Category has been successfully created"
    }
};
// delete category
const delete_category = async ({id}) => {
    const category = await _Category.findOne({id});
    if (!category) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    await _Category.deleteOne({id});
    return {
        code: 201,
        message: "Category delete Successfully!"
    }
}

// export module
module.exports = {
    get_all_categories,
    get_product_by_category,
    get_category_by_name,
    create_category,
    delete_category
};