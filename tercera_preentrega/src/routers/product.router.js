import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import * as ProductController from "../controllers/productsControllers.js";
import { authorize, ROLES } from "../middleware/authRoles.js";

const router = Router();

router.post("/", authorize([ROLES.admin]), ProductController.createProduct);

router.put("/:pid", authorize([ROLES.admin]), ProductController.updateProduct);

router.get("/:pid", ProductController.getProductById);

router.delete("/:pid", authorize([ROLES.admin]), ProductController.deleteProduct);

router.get("/", isAuthenticated, ProductController.getAllProducts);

export default router;