'use strict'

// services
const { 
    get_all_brands ,
    get_product_by_brand,
    get_brand_by_name,
    create_brand,
    delete_brand
} = require('../services/brand.service');

// get all brands
const getAllBrands = async (req, res) => {
    const {code, metadata, message} = await get_all_brands();

    return res.status(code).json({
        code, metadata, message
    })
};
// get product by brand
const getProductByBrand = async (req, res) => {
    const idBrand = req.params.brand;
    const {code, metadata, message} = await get_product_by_brand({idBrand});

    return res.status(code).json({
        code, metadata, message
    })
};
// get brand by name
const getBrandByName = async (req, res) => {
    const id = req.params.id;
    const {code, metadata, message} = await get_brand_by_name({id});

    return res.status(code).json({
        code, metadata, message
    })
};
// create new brand
const createBrand = async (req, res) => {
    const {id, name} = req.body;
    const image = req.file.path.split('\\').slice(1).join('/');

    const {code, message} = await create_brand({id, name, image});

    return res.status(code).json({
        code, message
    });
}
// delete brand
const deleteBrand = async (req, res) => {
    const id = req.params.id;
    const {code, message} = await delete_brand({id});

    return res.status(code).json({
        code, message
    })
}

// export module
module.exports = {
    getAllBrands,
    getProductByBrand,
    getBrandByName,
    createBrand,
    deleteBrand
}
