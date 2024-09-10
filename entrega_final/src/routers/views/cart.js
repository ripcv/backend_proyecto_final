import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.js";
import ViewCartController from "../../controllers/views/cart.js";

const ViewCartRouter = Router();

const ViewCart = new ViewCartController();

ViewCartRouter.get("/:cid", isAuthenticated, ViewCart.getCartById);

export default ViewCartRouter;
