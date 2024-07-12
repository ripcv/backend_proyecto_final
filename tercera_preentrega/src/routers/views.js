import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middleware/auth.js";
import { authorize , ROLES } from "../middleware/authRoles.js";
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

router.get("/api/product/create", authorize([ROLES.admin]), renderProductForm);
router.get("/api/product/edit/:pid", authorize([ROLES.admin]), renderProductForm);

export default router;
