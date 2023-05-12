'use strict'

// services
const { 
    get_all_products,
    get_product_by_id,
    search_product,
    create_product,
    update_product,
    delete_product
} = require('../services/product.service');

// get all products
const getAllProducts = async (req, res) => {
    const {code, metadata, message} = await get_all_products({});
    
    return res.status(code).json({
        code, metadata, message
    });
};
// get product by id
const getProductById = async (req, res) => {
    const id = req.params.id;
    const {code, metadata, message} = await get_product_by_id({id});
    
    return res.status(code).json({
        code, metadata, message
    });
};
// get product by id
const searchProduct = async (req, res) => {
    const key = req.body.key;
    const {code, metadata, message} = await search_product({key});
    
    return res.status(code).json({
        code, metadata, message
    });
};
// create new product
const createProduct = async (req, res) => {
    const {
        id, name, qty, category, brand, price, details
    } = req.body;

    const image = req.file.path.split('\\').slice(1).join('/');
    const {code, message} = await create_product({
        id, name, qty, category, brand, price, image, details
    });

    return res.status(code).json({
        code, message
    });
};
// update product
const updateProduct = async (req, res) => {
    const id = req.params.id;
    const {qty, price} = req.body;

    const {code, metadata, message} = await update_product({
        id, qty, price
    });

    return res.status(code).json({
        code, metadata, message
    });
}
// delete product
const deleteProduct = async (req, res) => {
    const id = req.params.id;

    const {code, message} = await delete_product({id});

    return res.status(code).json({
        code, message
    });
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