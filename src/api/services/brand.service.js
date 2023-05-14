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
const _Brand = require('../models/brand.model');

// get all brands
const get_all_brands = async () => {
    const brands = await _Brand.find({});
    if (!brands) {
        return {
            code: 500,
            message: 'Internal Server Error'
        }
    }

    return {
        code: 200,
        metadata: {
            brands
        }
    }
};
// get product by brand
const get_product_by_brand = async ({idBrand}) => {
    const brand = await _Brand.findOne({id: idBrand});
    if (brand.length === 0) {
        return {
            code: 401,
            message: "Brand not exist in database!"
        }
    }
    const products = await _Product.find({brand: brand.name});
    if (products.length === 0) {
        return {
            code: 401,
            message: "Brand not exist in database!"
        }
    }
    return {
        code: 200,
        metadata: {
            products
        }
    }
};
// get brand by name
const get_brand_by_name = async ({id}) => {
    const brand = await _Brand.findOne({id});
    if (!brand) {
        return {
            code: 401,
            message: "Brand not exist in database!"
        }
    }
    return {
        code: 200,
        metadata: {
            brand
        }
    }
}
// create new brand
const create_brand = async ({id, name, image}) => {
    const newBrand = {id, name, image};

    const brand = await _Brand.create(newBrand);

    return {
        code: 201,
        message: "Brand has been successfully created"
    }
};
// delete brand
const delete_brand = async ({id}) => {
    const brand = await _Brand.findOne({id});
    if (!brand) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    await _Brand.deleteOne({id});
    if (storage === false) {
        await fs.remove(`public/${brand.image}`);
    } else {
        await deleteObject(ref(storage, brand.image));
    }
    return {
        code: 201,
        message: "Brand delete Successfully!"
    }
}

// export module
module.exports = {
    get_all_brands,
    get_product_by_brand,
    get_brand_by_name,
    create_brand,
    delete_brand
}