import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middleware/auth.js";
import { isAdmin } from "../middleware/role.js";
import { renderProductForm } from "../controllers/productsControllers.js";

const router = Router();

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login");
});

router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register");
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user, pageProfile: "true" });
});

router.get("/api/product/create", isAdmin, renderProductForm);
router.get("/api/product/edit/:pid", isAdmin, renderProductForm);

export default router;
