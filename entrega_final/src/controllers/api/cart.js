import * as CartServices from "../../services/cartsService.js";
import * as ProductServices from "../../services/productsService.js";
import { sendMail } from "../../utils.js";
import PaymentService from "../../services/payment.js";

class ApiCartController {
  async getAllCarts(req, res) {
    try {
      const carts = await CartServices.getAllCarts();
      if (!carts) return carts;
      res.send({ status: "success", payload: carts });
    } catch (error) {
      res.send({
        status: "error",
        error: "Error la obtención de los carritos",
      });
    }
  }

  async addProducts(req, res) {
    let { products = [] } = req.body;
    //asignamos el valor del id proveniente del formulario
    let product = req.body.productId;
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

      const response = await CartServices.addProducts(cart, products);

      return res.status(200).json({
        success: true,
        message: "Producto agregado exitosamente",
      });
    } catch (error) {
      res.send({ status: "error", error: "Error en el servidor" });
    }
  }

  async updateCartContent(req, res) {
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
          { new: true }
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

  async deleteCartContent(req, res) {
    let { cid } = req.params;
    try {
      let result = await CartServices.deleteCartContent(cid);
      res.send({ result: "success", payload: result });
    } catch (error) {
      res.send({ status: "error", error: "Error eliminando el contenido" });
    }
  }

  async deleteCartProduct(req, res) {
    let { cid, pid } = req.params;
    try {
      const updateCart = await CartServices.deleteCartProduct(cid, pid);
      res.send({ result: "success", payload: updateCart });
    } catch (error) {
      res.send({ status: "error", error: "Error eliminando el producto" });
    }
  }

  async purchaseCart(req, res) {
    const { cartId } = req.body;
    const cart = await CartServices.getCartById(cartId);
    if (cart.products.length === 0)
      return res.status(200).json({ error: true, message: "Carrito Vacio" });
    //validamos el stock y lo descontamos del producto
    const infoPurchase = await CartServices.stockCheck(cart);
    if (infoPurchase.inStock != "") {
      const productList = infoPurchase.inStock.map((item) => ({
        product_data: {
          name: item.product.title,
          unit_aount: item.product.price,
          quantity: item.quantity,
        },
      }));

      const paymentInfo = {
        amount: cart.total,
        currency: "usd",
        metadata: {
          products: JSON.stringify(productList),
        },
      };

      //Hacemos la llamada a stripe para generar el pago.
      const service = new PaymentService();
      const session = await service.createPaymentIntent(paymentInfo);
      if(!session){
        return res.status(500).json({ error: true, message: "Error al procesar el pago" });
      }
       return res.status(200).json({ sessionId: session.id , clientSecret : session.client_secret }); // Enviamos el sessionId al frontend
   
      
    }

    return res.status(404).json({
      error: true,
      message: "Compra No procesada ",
      products: infoPurchase.outStock,
    });
  }

  async successPurchase (req,res){
    const { cid } = req.params
    const cart = await CartServices.getCartById(cid);
    const infoPurchase = await CartServices.stockCheck(cart);

      for (const purchase of infoPurchase.inStock) {
        const productId = purchase.product._id;
        const productUpdate = {
          stock: purchase.stock - purchase.quantity,
        };
        await ProductServices.updateProduct(productId, productUpdate);
       // total += parseInt(purchase.product.price * purchase.quantity);
        await CartServices.deleteCartProduct(cid, productId);
      }
     
      //Generamos el Ticket
      const result = await CartServices.generateTicket(
        cid,
        cart.total,
        req.session.user.email,
      ); 
      //Generamos el Correo
      await sendMail(req.session.user.email, result); 
      return res.status(200).json({
        status: "success",
        message: "Compra procesada exitosamente",
        ticket: result,
        products: infoPurchase.outStock,
      });
  }
}

export default ApiCartController;
