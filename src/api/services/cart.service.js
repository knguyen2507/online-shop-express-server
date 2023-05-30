'use strict'

// models
const _Cart = require('../models/cart.model');
const _Product = require('../models/product.model');
// core
const {
    InternalServerError, 
    BadRequestError,
    UnauthorizedError
} = require('../core/error.res');

// get cart by id
const get_cart_by_id = async ({id}) => {
    const cart = await _Cart.find({idUser: id});
    if (!cart) throw new InternalServerError();
    return {
        code: 201,
        metadata: cart
    }
};
// add product to cart
const add_product_to_cart = async ({id, idProduct}) => {
    const cart = await _Cart.findOne({idUser: id, idProduct});
    const productInInventory = await _Product.findOne({id: idProduct});

    if (!productInInventory) throw new InternalServerError();

    if (cart) {
        return await add_qty_product_in_cart({id: cart._id, idUser: id});
    }

    if (productInInventory.qty < 1) throw new BadRequestError('Mua vượt quá số lượng hàng hóa')

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
        message: `Thêm sản phẩm ${productInInventory.name} vào giỏ hàng thành công!`
    }
};
// add qty product in cart
const add_qty_product_in_cart = async ({id, idUser}) => {
    const cart = await _Cart.findOne({_id: id});
    if (!cart) throw new InternalServerError();

    if (cart.idUser !== idUser) throw new UnauthorizedError('Bạn không có quyền truy cập');

    const productInInventory = await _Product.findOne({id: cart.idProduct});

    if (productInInventory.qty === cart.qty) throw new BadRequestError('Mua vượt quá số lượng hàng hóa')

    await _Cart.updateOne(
        {_id: id}, 
        {$set: {qty:cart.qty + 1}}
    );

    return {
        code: 201,
        message: `Thêm 1 sản phẩm vào giỏ hàng ${id}!`
    }
}
// reduce qty product in cart
const reduce_product_in_cart = async ({id, idUser}) => {
    const cart = await _Cart.findOne({_id: id});
    if (!cart) throw new InternalServerError();

    if (cart.idUser !== idUser) throw new UnauthorizedError('Bạn không có quyền truy cập');

    if (cart.qty === 1) {
        return await remove_product_from_cart({id, idUser})
    }

    await _Cart.updateOne(
        {_id: id}, 
        {$set: {qty:cart.qty - 1}}
    );

    return {
        code: 201,
        message: `Giảm 1 sản phẩm trong giỏ hàng ${id}!`
    }
};
// remove product from cart
const remove_product_from_cart = async ({id, idUser}) => {
    const cart = await _Cart.findOne({_id: id});
    if (!cart) throw new InternalServerError();

    if (cart.idUser !== idUser) throw new UnauthorizedError('Bạn không có quyền truy cập');

    await _Cart.deleteOne({_id: id})

    return {
        code: 201,
        message: `Gỡ giỏ hàng ${id}!`
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