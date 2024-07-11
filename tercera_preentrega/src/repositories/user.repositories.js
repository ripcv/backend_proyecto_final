import userModel from "../dao/models/users.model.js";

class UserRepository {
    constructor(userModel){
        this.userModel = userModel;
    }
    async createUser(newUser){
        const user = await this.userModel.create(newUser)
        return user
    }

    async findUser(email){
        const user = await this.userModel.findOne({email: email})
        return user
    }
}

export default UserRepository