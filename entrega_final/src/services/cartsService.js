import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";
import { getProductById } from "./productsService.js";
import { codeTicketGenerator } from "../utils.js";
import ticketModel from "../dao/models/ticket.model.js";
import { logger } from "../logger/logger.js"
import { validTypeMongoose } from "../utils.js";

export async function getAllCarts() {
  let carts = await cartModel.find();
  if (carts.length === 0) {
    return null;
  }
  return carts;
}

export async function getCartById(cid) {
  if(!validTypeMongoose(cid)) return false

  const cart = await cartModel
    .findOne({ _id: cid })
    .populate({
      path: "products.product",
      select: "title price",
    })
    .lean();
  if (!cart) {
    return false;
  }
  
  return cart;
} 

export async function createCart() {
  const cart = await cartModel.create({});
  return cart;
}
export async function addProducts(cartId, products) {
  try {
    const cart = await cartModel.findByIdAndUpdate(
      cartId,
      { $addToSet: { products: [] } },
      { new: true },
    );
    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found`);
    }

    let total = cart.total || 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productPrice = await productModel
        .findOne({ _id: product.product })
        .select("price");

      if (!productPrice) {
        throw new Error(`Producto con ID ${product.product} no encontrado`);
      }

      const price = productPrice.price;
      const quantity = product.quantity ? product.quantity : 1;
      const totalProduct = price * quantity;

      const existingProductIndex = cart.products.findIndex((p) =>
        p.product._id.equals(product.product),
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({
          product: product.product,
          quantity: quantity,
          price: price,
        });
      }

      total += totalProduct;
    }

    cart.total = total;
    await cart.save();
    return cart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export async function updateCartContent() {}

export async function deleteCartContent(cid) {
  let cart = await cartModel.findByIdAndUpdate(
    { _id: cid },
    { products: [], total: 0 },
    { new: true },
  );
  return cart;
}

export async function deleteCartProduct(cid, pid) {
  //buscamos el carrito
  const cartExist = await getCartById(cid);
  if (!cartExist) {
    return res
      .status(400)
      .send({ status: "error", error: `Carrito con ID ${cid} no encontrado` });
  }
  //actualizamos el carrito
  await updateCart(cid, pid);
  // Calculamos nuevamente el total
  const updatedCartWithTotal = await cartTotalCalc(cid);

  return updatedCartWithTotal;
}

export async function updateCart(cid, pid) {
  const productInCart = await cartModel.findOne({
    _id: cid,
    "products.product": pid,
  });
  if (!productInCart) {
    return null;
  }
  const updateCart = await cartModel.findOneAndUpdate(
    { _id: cid },
    { $pull: { products: { product: pid } } },
    { new: true },
  );
  return updateCart;
}

export async function cartTotalCalc(cid) {
  const findCart = await cartModel.findOne({ _id: cid }).populate({
    path: "products.product",
    select: "price",
  });

  let total = 0;
  findCart.products.forEach((product) => {
    total += product.product.price * product.quantity;
  });

  const updatedCartWithTotal = await cartModel.findByIdAndUpdate(
    cid,
    { $set: { total } },
    { new: true },
  );

  return updatedCartWithTotal;
}

export async function stockCheck(cart) {
  const stock = {
    inStock: [],
    outStock: [],
  };
  const checkStock = cart.products.map(async (createProduct) => {
    const product = await getProductById(createProduct.product);
    if (product.stock <= createProduct.quantity) {
      stock.outStock.push(createProduct.product.title);
    } else {
      const data = {
        product: createProduct.product,
        quantity: createProduct.quantity,
        stock: product.stock,
      };
      stock.inStock.push(data);
    }
  });

  const stockResult = await Promise.all(checkStock);

  return stock;
}

export async function generateTicket(cartId, total, email) {
  const code = await codeTicketGenerator(cartId);

  const ticketData = {
    code,
    amount: total,
    purchaser: email,
  };

  const result = await ticketModel.create(ticketData);
  return result;
}
