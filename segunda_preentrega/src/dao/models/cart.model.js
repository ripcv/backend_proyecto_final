import mongoose from "mongoose";

const cartCollection = "Carritos"

const cartSchema = new mongoose.Schema({
    user: {type: String, required:true, max:100},
    products: [ 
        {
            product: {type: String, required:true},
            quantity: { type: Number , default:1}
        }
    ]

})

const cartModel = mongoose.model(cartCollection,cartSchema)

export default cartModel