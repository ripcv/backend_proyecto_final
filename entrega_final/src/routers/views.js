import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middleware/auth.js";
import { authorize , ROLES } from "../middleware/authRoles.js";
import { isValidToken } from "../middleware/authToken.js";

const router = Router();

router.get("/", isNotAuthenticated, (req, res) => {
  res.render("login");
});

router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register");
});

router.get("/reset_password",isNotAuthenticated,(req,res)=>{
  res.render("reset_password")
})

router.get("/change_password",isValidToken,(req,res)=>{
  res.render("change_password",{userID : req.query.id})
})

router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user, pageProfile: "true" });
});
export default router;
