import mongoose from "mongoose";

const userCollection = "Users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true, sparse: true },
  age: Number,
  password: String,
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" },
  role: { type: String, default: "user" },
  githubId: { type: String, unique: true, sparse: true },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
