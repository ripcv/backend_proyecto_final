import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import * as ProductController from "../controllers/productsControllers.js";
import { isAdmin } from "../middleware/role.js";

const router = Router();

router.post("/", isAdmin, ProductController.createProduct);

router.put("/:pid", isAdmin, ProductController.updateProduct);

router.get("/:pid", ProductController.getProductById);

router.delete("/:pid", isAdmin, ProductController.deleteProduct);

router.get("/", isAuthenticated, ProductController.getAllProducts);

export default router;
