import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import * as ChatController from "../controllers/chatController.js";

const router = Router();

router.get("/", isAuthenticated, ChatController.getAllChats);

router.post("/", isAuthenticated, ChatController.saveChat);

export default router;
