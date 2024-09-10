import { Router } from "express";
import ViewProductController from "../../controllers/views/products.js";
import { isAuthenticated } from "../../middleware/auth.js";
import { authorize, ROLES } from "../../middleware/authRoles.js";

const ViewProducts = new ViewProductController();

const ViewProductRouter = Router();

ViewProductRouter.get(
  "/create",
  isAuthenticated,
  authorize([ROLES.admin, ROLES.premium]),
  ViewProducts.renderProductForm
);
ViewProductRouter.get(
  "/edit/:pid",
  isAuthenticated,
  authorize([ROLES.admin, ROLES.premium]),
  ViewProducts.renderProductForm
);
ViewProductRouter.get("/", ViewProducts.getAllProducts);

export default ViewProductRouter;
