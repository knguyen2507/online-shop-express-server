'use strict'

const { 
    ref,
    uploadBytesResumable 
} = require('firebase/storage');
// configs
const { storage } = require('../configs/config.storedFile');
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
    const image = `uploads/brands/${req.file.originalname.split('.')[0]}/${req.file.originalname}`;

    if (storage !== false) {
        const storageRef = ref(storage, image);
        const data = {
            contentType: req.file.mimetype,
        };
        // Upload the file in the bucket storage
        await uploadBytesResumable(storageRef, req.file.buffer, data);
    }

    const {code, message} = await create_product({
        id, name, qty, category, brand, price, image, details
    });

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
