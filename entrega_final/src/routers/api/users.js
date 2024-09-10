import Router from "express";
import ApiUserController from "../../controllers/api/users.js";

const ApiUserRouter = Router();

const ApiUser = new ApiUserController();

ApiUserRouter.get("/", ApiUser.getAllUsers);

ApiUserRouter.get("/:uid", ApiUser.getUserById);

ApiUserRouter.put("/:uid", ApiUser.updateUser);

ApiUserRouter.put("/premium/:uid", ApiUser.updatepremium);

ApiUserRouter.post("/:uid/documents", ApiUser.uploadDocuments);

ApiUserRouter.delete("/", ApiUser.deleteUsersByLastLogin);

ApiUserRouter.delete("/:uid", ApiUser.deleteUser);
export default ApiUserRouter;
