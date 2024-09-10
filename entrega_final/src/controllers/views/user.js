import * as UserService from "../../services/usersService.js";
import UserDto from "../../dto/user.dto.js";

class ViewUserController {

    async getAllUsers(req, res){
        const users = await UserService.getAllUsers()
        res.render("user", {viewUsers : users, user: req.session.user})
    }

    async getUserById(req,res){
        const uid = req.params.uid
        const user = await UserService.getUserById(uid)
        const userDTO = new UserDto(
            user._id,
            user.first_name,
            user.last_name,
            user.email,
            user.age,
            user.role,
            user.cartId ? user.cartId._id : null,
            user.documents ? user.documents : null,
            user.last_connection
          );

        if(!userDTO){}
        
        res.render("userForm", {viewUser : userDTO, user: req.session.user})
    }
}

export default ViewUserController