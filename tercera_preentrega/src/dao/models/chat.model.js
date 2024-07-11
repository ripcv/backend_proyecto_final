import mongoose from "mongoose";

const messageCollection = "Chat";

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true, max: 30 },
  message: { type: String, required: true, max: 200 },
});

const chatModel = mongoose.model(messageCollection, messageSchema);

export default chatModel;
