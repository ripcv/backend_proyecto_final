import mongoose from "mongoose";

const ticketCollection = "Ticket";

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, require: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: String,
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
