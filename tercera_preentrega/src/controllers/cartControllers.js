import * as CartServices from "../services/cartsService.js";
import * as ProductServices from "../services/productsService.js";
import { sendMail } from "../utils.js";

export async function getAllCarts(req, res) {
  try {
    const carts = await CartServices.getAllCarts();
    if (!carts) return carts;
    res.send({ status: "success", payload: carts });
  } catch (error) {
    res.send({ status: "error", error: "Error la obtención de los carritos" });
  }
}

export async function getCartByIdToRender(req, res) {
  let { cid } = req.params;
  try {
    const cart = await CartServices.getCartById(cid);
    if (!cart) return false;
    res.render("carts", {
      cart,
      cid,
      user: req.session.user,
      isAdmin: req.session.user.role === "admin",
      pageCart: "true",
    });
  } catch (error) {
    res.send({
      status: "error",
      error: "Error en la obtencion de los productos",
    });
  }
}

export async function addProducts(req, res) {
  let { products = [] } = req.body;
  //asignamos el valor del id proveniente del formulario
  let product = req.body.product;

  try {
    let cartId = req.user.cartId ? req.user.cartId : null;
    let cart;
    if (products.length === 0 && !product) {
      cart = await CartServices.createCart();
      req.user.cartId = { cartId: cart._id };
      return res.send({ result: "success", payload: cart });
    }
    if (product) {
      products = [
        {
          product: product,
        },
      ];
    }
    // Buscar el carrito existente en la sesión
    if (cartId) {
      cart = await CartServices.getCartById(cartId);
    }

    await CartServices.addProducts(cart, products);

    res.redirect("/api/products?msg=ok");
  } catch (error) {
    console.log(error);
    res.send({ status: "error", error: "Error en el servidor" });
  }
}

export async function updateCartContent(req, res) {
  const { cid, pid } = req.params;
  let quantity = req.body.quantity;

  if (!quantity || typeof quantity !== "number" || quantity <= 0) {
    quantity = 1;
  }

  try {
    //Verificamos si el carrito existe.
    const cartExist = await CartServices.getCartById(cid);
    if (!cartExist) {
      return res.status(400).send({
        status: "error",
        error: `Carrito con ID ${cid} no encontrado`,
      });
    }

    //verificamos si el producto esta en el carrito
    const productInCart = await CartServices.updateCart(cid, pid);
    if (!productInCart) {
      const updatedCart = await cartModel.findOneAndUpdate(
        { _id: cid },
        { $push: { products: { product: pid, quantity } } },
        { new: true },
      );
    }

    //se actualiza el total del carrito
    const updatedCartWithTotal = await CartServices.cartTotalCalc(cid);

    res.send({ result: "success", payload: updatedCartWithTotal });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", error: "Error actualizando el carrito" });
  }
}

export async function deleteCartContent(req, res) {
  let { cid } = req.params;
  try {
    let result = await CartServices.deleteCartContent(cid);
    res.send({ result: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", error: "Error eliminando el contenido" });
  }
}

export async function deleteCartProduct(req, res) {
  let { cid, pid } = req.params;
  try {
    const updateCart = await CartServices.deleteCartProduct(cid, pid);
    res.send({ result: "success", payload: updateCart });
  } catch (error) {
    res.send({ status: "error", error: "Error eliminando el producto" });
  }
}

export async function purchaseCart(req, res) {
  const { cartId } = req.body;
  const cart = await CartServices.getCartById(cartId);
  if (cart.products.length === 0)
    return res.status(200).json({ error: true, message: "Carrito Vacio" });
  //validamos el stock y lo descontamos del producto
  const infoPurchase = await CartServices.stockCheck(cart);
  let total = 0;
  if (infoPurchase.inStock != "") {
    for (const purchase of infoPurchase.inStock) {
      const productId = purchase.product._id;
      const productUpdate = {
        stock: purchase.stock - purchase.quantity,
      };
      await ProductServices.updateProduct(productId, productUpdate);
      total += parseInt(purchase.product.price * purchase.quantity);
      await CartServices.deleteCartProduct(cartId, productId);
    }
    //Generamos el Ticket
    const result = await CartServices.generateTicket(
      cartId,
      total,
      req.session.user.email,
    );
    //Generamos el Correo
    await sendMail(req.session.user.email, result);
    return res.status(200).json({
      success: true,
      message: "Compra procesada exitosamente",
      ticket: result,
      products: infoPurchase.outStock,
    });
  }

  return res.status(200).json({
    error: true,
    message: "Compra No procesada ",
    products: infoPurchase.outStock,
  });
}
