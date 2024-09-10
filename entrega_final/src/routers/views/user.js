import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.js";
import { authorize, ROLES } from "../../middleware/authRoles.js";
import ViewUserController from "../../controllers/views/user.js";



const ViewUser = new ViewUserController()

const ViewUserRouter = Router();

ViewUserRouter.get("/",isAuthenticated,authorize([ROLES.admin]),ViewUser.getAllUsers)

ViewUserRouter.get("/edit/:uid",isAuthenticated,authorize([ROLES.admin]),ViewUser.getUserById)



export default ViewUserRouter