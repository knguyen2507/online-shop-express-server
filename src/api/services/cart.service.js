'use strict'

// models
const _Cart = require('../models/cart.model');
const _Product = require('../models/product.model');
// get cart by id
const get_cart_by_id = async ({id}) => {
    const cart = await _Cart.find({idUser: id});
    if (!cart) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }
    return {
        code: 201,
        metadata: cart
    }
};
// add product to cart
const add_product_to_cart = async ({id, idProduct}) => {
    const cart = await _Cart.findOne({idUser: id, idProduct});
    const productInInventory = await _Product.findOne({id: idProduct});

    if (!productInInventory) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }

    if (cart) {
        return await add_qty_product_in_cart({id: cart._id, idUser: id});
    }

    if (productInInventory.qty < 1) {
        return {
            code: 401,
            message: "You buy more than the qty of product in inventory"
        }
    }

    await _Cart.create({
        idUser: id,
        idProduct: productInInventory.id,
        name: productInInventory.name,
        qty: 1,
        price: productInInventory.price,
        image: productInInventory.image
    })

    return {
        code: 201,
        message: `Add product ${productInInventory.name} Successfully!`
    }
};
// add qty product in cart
const add_qty_product_in_cart = async ({id, idUser}) => {
    const cart = await _Cart.findOne({_id: id});
    if (!cart) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }

    if (cart.idUser !== idUser) {
        return {
            code: 401,
            message: "You does not have access!"
        }
    }

    const productInInventory = await _Product.findOne({id: cart.idProduct});

    if (productInInventory.qty === cart.qty) {
        return {
            code: 401,
            message: "You buy more than the qty of product in inventory"
        }
    }

    await _Cart.updateOne(
        {_id: id}, 
        {$set: {qty:cart.qty + 1}}
    );

    return {
        code: 201,
        message: `Add 1 item from Cart ${id}!`
    }
}
// reduce qty product in cart
const reduce_product_in_cart = async ({id, idUser}) => {
    const cart = await _Cart.findOne({_id: id});
    if (!cart) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }

    if (cart.idUser !== idUser) {
        return {
            code: 401,
            message: "You does not have access!"
        }
    }

    if (cart.qty === 1) {
        return await remove_product_from_cart({id, idUser})
    }

    await _Cart.updateOne(
        {_id: id}, 
        {$set: {qty:cart.qty - 1}}
    );

    return {
        code: 201,
        message: `Reduce 1 item from Cart ${id}!`
    }
};
// remove product from cart
const remove_product_from_cart = async ({id, idUser}) => {
    const cart = await _Cart.findOne({_id: id});
    if (!cart) {
        return {
            code: 500,
            message: "Internal Server Error"
        }
    }

    if (cart.idUser !== idUser) {
        return {
            code: 401,
            message: "You does not have access!"
        }
    }

    await _Cart.deleteOne({_id: id})

    return {
        code: 201,
        message: `Remove Cart ${id}!`
    }
}

// export module
module.exports = {
    get_cart_by_id,
    add_product_to_cart,
    add_qty_product_in_cart,
    reduce_product_in_cart,
    remove_product_from_cart
};