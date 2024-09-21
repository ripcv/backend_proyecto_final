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
  authorize([ROLES.admin,ROLES.premium]),
  ApiProducts.createProduct
);

ApiProductRouter.put("/:pid", isAuthenticated, ApiProducts.updateProduct);

ApiProductRouter.delete(
  "/:pid",
  isAuthenticated,
  authorize([ROLES.admin, ROLES.premium]),
  ApiProducts.deleteProduct
);

export default ApiProductRouter;
