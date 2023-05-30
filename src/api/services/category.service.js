'use strict'

// models
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');
// core
const {
    InternalServerError
} = require('../core/error.res');

// get all categories
const get_all_categories = async () => {
    const categories = await _Category.find({});
    if (!categories) throw new InternalServerError();
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
    if (!category) throw new InternalServerError();
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

    await _Category.create(newCategory);

    return {
        code: 201,
        message: `Danh mục ${name} tạo mới thành công`
    }
};
// delete category
const delete_category = async ({id}) => {
    const category = await _Category.findOne({id});
    if (!category) throw new InternalServerError();
    await _Category.deleteOne({id});
    return {
        code: 201,
        message: `Danh mục ${category.name} xóa thành công`
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