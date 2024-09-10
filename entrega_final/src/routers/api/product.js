import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.js";
import ApiProductsController from "../../controllers/api/products.js";
import { authorize, ROLES } from "../../middleware/authRoles.js";

const ApiProducts = new ApiProductsController();
const ApiProductRouter = Router();

ApiProductRouter.get("/", ApiProducts.getAllProducts);

ApiProductRouter.get("/:pid", ApiProducts.getProductById);

ApiProductRouter.post(
  "/",
  isAuthenticated,
  authorize([ROLES.admin]),
  ApiProducts.createProduct
);

ApiProductRouter.put("/:pid", isAuthenticated, ApiProducts.updateProduct);

ApiProductRouter.delete("/:pid", authorize([ROLES.admin]), ApiProducts.deleteProduct);

export default ApiProductRouter;
