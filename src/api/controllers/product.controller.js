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
    get_all_products,
    get_product_by_id,
    search_product,
    create_product,
    update_product,
    delete_product
} = require('../services/product.service');
// core
const {
    OK, CREATED
} = require('../core/success.res');

// get all products
const getAllProducts = async (req, res) => {
    const {code, metadata, message} = await get_all_products({});
    
    new OK ({
        code, message, metadata
    }).send(res);
};
// get product by id
const getProductById = async (req, res) => {
    const id = req.params.id;
    const {code, metadata, message} = await get_product_by_id({id});
    
    new OK ({
        code, message, metadata
    }).send(res);
};
// get product by id
const searchProduct = async (req, res) => {
    const key = req.body.key;
    const {code, metadata, message} = await search_product({key});
    
    new OK ({
        code, message, metadata
    }).send(res);
};
// create new product
const createProduct = async (req, res) => {
    const {
        id, name, qty, category, brand, price, details
    } = req.body;

    let firebase = '';

    const image = `uploads/products/${id}/${req.file.originalname}`;

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

    const {code, message} = await create_product({
        id, name, qty, category, brand, price, image, details, firebase
    });

    new CREATED ({
        code, message
    }).send(res);
};
// update product
const updateProduct = async (req, res) => {
    const id = req.params.id;
    const {qty, price} = req.body;

    const {code, metadata, message} = await update_product({
        id, qty, price
    });

    new OK ({
        code, message, metadata
    }).send(res);
}
// delete product
const deleteProduct = async (req, res) => {
    const id = req.params.id;

    const {code, message} = await delete_product({id});

    new OK ({
        code, message
    }).send(res);
}

// export module
module.exports = {
    getAllProducts,
    getProductById,
    searchProduct,
    createProduct,
    updateProduct,
    deleteProduct
}