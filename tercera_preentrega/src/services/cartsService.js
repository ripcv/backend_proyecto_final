import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js"
import mongoose from "mongoose";

export async function getAllCarts() {
    let carts = await cartModel.find()
    if (carts.length === 0) {
        return null
    }
    return carts
}

export async function getCartByIdToRender(cid) {
    let cart = await cartModel.findOne({ _id: cid }).populate({
        path: 'products.product',
        select: 'title price'
    }).lean();
    if (!cart) {
        return false
    }
    return cart
}
export async function getCartById(cid) {
    let cart = await cartModel.findOne({ _id: cid }).populate({
        path: 'products.product',
        select: 'title price'
    })
    if (!cart) {
        return false
    }
    return cart
}

export async function createCart(){
 const cart = await cartModel.create({});
 return cart
}

export async function addProducts(cart, products) {
    let total = cart.total || 0;
    let productWithPrices = cart.products || [];
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let productPrice = await productModel.findOne({ _id: product.product }).select("price");

        if (!productPrice) {
            throw new Error(`Producto con ID ${product.product} no encontrado`);
        }

        let price = productPrice.price;
        let quantity = product.quantity ? product.quantity : 1;
        let totalProduct = price * quantity;

        let productIdObject = mongoose.Types.ObjectId.createFromHexString(product.product);

        let existingProductIndex = productWithPrices.findIndex(p => p.product.equals(productIdObject));

        if (existingProductIndex !== -1) {
            productWithPrices[existingProductIndex].quantity += quantity;
            productWithPrices[existingProductIndex].price = price;
        } else {
            productWithPrices.push({
                product: productIdObject,
                quantity: quantity,
                price: price
            });
        }

        total += totalProduct;
    }

    cart.products = productWithPrices;
    cart.total = total;

    await cart.save(); 
    return cart;
}


export async function updateCartContent(){

}


export async function deleteCartContent(cid) {
    let cart = await cartModel.findByIdAndUpdate({ _id: cid },{products:[],total:0},{new: true})
    return cart
}

export async function updateCart(cid,pid){
    const productInCart = await cartModel.findOne({ _id: cid, 'products.product': pid });
    if (!productInCart) {
        return null
    }
    const updateCart = await cartModel.findOneAndUpdate(
        {_id: cid},
        {$pull:{products: {product:pid}}},
        {new:true}
    )
    return updateCart
}

export async function cartTotalCalc(cid){
    const findCart = await cartModel.findOne({ _id: cid }).populate({
        path: 'products.product',
        select: 'price'
    });

    let total = 0;
    findCart.products.forEach(product => {
        total += product.product.price * product.quantity;
    });

    const updatedCartWithTotal = await cartModel.findByIdAndUpdate(
        cid,
        { $set: { total } },
        { new: true }
    )

    return updatedCartWithTotal
}