import mongoose from "mongoose";
import userModel from "../dao/models/users.model.js";

class UserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }
  async createUser(newUser) {
    const user = await this.userModel.create(newUser);
    return user;
  }

  async getAllUsers() {
    const users = await this.userModel.find().lean().select("-password");
    return users;
  }
  async findUser(filter) {
    const user = await this.userModel.find(filter);
    return user;
  }

  async updateUser(userID, updates) {
    const result = await userModel.updateOne(
      { _id: userID },
      { $set: updates }
    );
    return result;
  }

  async deleteUsers(filter) {
    const result = await userModel.deleteMany(filter);
    if (!result) return false;
    return result;
  }
}

export default UserRepository;
