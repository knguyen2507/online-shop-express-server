'use strict'

const { 
    ref,
    uploadBytesResumable,
    getDownloadURL 
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
// core
const {
    OK, CREATED
} = require('../core/success.res');

// get all brands
const getAllBrands = async (req, res) => {
    const {code, metadata, message} = await get_all_brands();

    new OK ({
        code, message, metadata
    }).send(res);
};
// get product by brand
const getProductByBrand = async (req, res) => {
    const idBrand = req.params.brand;
    const {code, metadata, message} = await get_product_by_brand({idBrand});

    new OK ({
        code, message, metadata
    }).send(res);
};
// get brand by name
const getBrandByName = async (req, res) => {
    const id = req.params.id;
    const {code, metadata, message} = await get_brand_by_name({id});

    new OK ({
        code, message, metadata
    }).send(res);
};
// create new brand
const createBrand = async (req, res) => {
    const {id, name} = req.body;
    const image = `uploads/brands/${req.file.originalname.split('.')[0]}/${req.file.originalname}`;
    let firebase = '';

    if (storage !== false) {
        const storageRef = ref(storage, image);
        const data = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, data);

        // Grab the public url
        firebase = await getDownloadURL(snapshot.ref);
    }

    const {code, message} = await create_brand({
        id, name, image, firebase
    });

    new CREATED ({
        code, message
    }).send(res);
}
// delete brand
const deleteBrand = async (req, res) => {
    const id = req.params.id;
    const {code, message} = await delete_brand({id});

    new OK ({
        code, message
    }).send(res);
}

// export module
module.exports = {
    getAllBrands,
    getProductByBrand,
    getBrandByName,
    createBrand,
    deleteBrand
}
