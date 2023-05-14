'use strict'

const fs = require('fs-extra');
const { 
    ref,
    deleteObject 
} = require('firebase/storage');
// configs
const { storage } = require('../configs/config.storedFile');
// models
const _Product = require('../models/product.model');
// utils

// get all products
const get_all_products = async () => {
    const products = await _Product.find({});
    if (!products) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    return {
        code: 200,
        metadata: {
            products
        }
    }
};
// get product by id
const get_product_by_id = async ({id}) => {
    const product = await _Product.findOne({id});
    if (!product) {
        return {
            code: 401,
            message: "Product not exist in database!"
        }
    }
    return {
        code: 200,
        metadata: {
            product
        }
    }
};
// find products
const search_product = async ({key}) => {
    const keys = key.split(' ');
    let products = [];

    for (let i of keys) {
        const listProduct = await _Product.find({name: {"$regex": i, "$options": "i"}});
        products = products.concat(listProduct);
    }

    let op = [];
    if (keys.length > 1) {
        for (let i=0; i < products.length - 1; i++) {
            for (let j=i+1; j < products.length; j++) {
                if (products[i].id === products[j].id) {
                    op.push(products[i]);
                }
            }
        }
    } else {
        op = [...products];
    }

    if (products.length == 0) {
        return {
            code: 201,
            metadata: {products: []},
            message: `No results found for ${key}`
        }
    }

    return {
        code: 201,
        metadata: {
            products: op
        },
        message: "Successfully"
    }
}
// create new product
const create_product = async ({id, name, qty, category, brand, price, image, details}) => {
    const newProduct = {
        id, name, qty, category, brand, price, image, details
    };

    const product = await _Product.create(newProduct);

    return {
        code: 201,
        message: "Product has been successfully created"
    }
};
// update product
const update_product = async ({id, qty, price}) => {
    const product = await _Product.updateOne({id}, {$set: {qty, price}});

    return {
        code: 201,
        message: "Product updated Successfully!",
        metadata: product
    }
};
// delete product
const delete_product = async ({id}) => {
    const product = await _Product.findOne({id});
    if (!product) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    await _Product.deleteOne({id});
    if (storage === false) {
        await fs.remove(`public/${product.image}`);
    } else {
        await deleteObject(ref(storage, product.image));
    }
    return {
        code: 201,
        message: "Product delete Successfully!"
    }
}

// export module
module.exports = {
    get_all_products,
    get_product_by_id,
    search_product,
    create_product,
    update_product,
    delete_product
}