import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "Products";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 50 },
  description: { type: String, required: true, max: 100 },
  code: { type: String, required: true, max: 50 },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true, max: 50 },
  thumbnail: { type: String, max: 50 },
  status: { type: String, required: true, max: 10, default: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: new mongoose.Types.ObjectId("6684a2211df89a38c87da899"),
  },
});

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
