import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.js";
import ViewChatController from "../../controllers/views/chat.js";

const ViewchatRouter = Router();
const ViewChat = new ViewChatController()

ViewchatRouter.get("/", isAuthenticated, ViewChat.getAllChats);

ViewchatRouter.post("/", isAuthenticated, ViewChat.saveChat);

export default ViewchatRouter;
