import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.js";
import ApiCartController from "../../controllers/api/cart.js";

const ApiCartRouter = Router();
const ApiCart = new ApiCartController()

ApiCartRouter.get("/", isAuthenticated, ApiCart.getAllCarts);

ApiCartRouter.post("/", isAuthenticated,  ApiCart.addProducts);

ApiCartRouter.post("/:cid/purchase", isAuthenticated, ApiCart.purchaseCart);

//El Put esta con problemas, se debe corregir su funcionamiento.
ApiCartRouter.put("/:cid/products/:pid",  isAuthenticated,  ApiCart.updateCartContent);

//Elimina el contenido del carrito seleccionado
ApiCartRouter.delete("/:cid/",  isAuthenticated,  ApiCart.deleteCartContent);

//Elimina producto del carrito seleccionado
ApiCartRouter.delete("/:cid/products/:pid",   isAuthenticated, ApiCart.deleteCartProduct);

export default ApiCartRouter;
