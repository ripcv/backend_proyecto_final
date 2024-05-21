import mongoose from "mongoose";

const productCollection = "Productos"

const productSchema = new mongoose.Schema({
    title: {type: String, required:true, max:50},
    description: {type: String, required:true, max:100},
    code: {type: String, required:true, max:50},
    price: {type: Number, required:true},
    stock: {type: Number, required:true},
    category: {type: String, required:true, max:50},
    thumbnail: {type: String, max:50},
    status: {type: String, required:true, max:10},
})

const productModel = mongoose.model(productCollection,productSchema)

export default productModel
