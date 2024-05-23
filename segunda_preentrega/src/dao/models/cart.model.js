import mongoose from "mongoose";

const cartCollection = "Carts"

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productModel',
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    total: {
        type: Number,
        default: 0
    }
});


const cartModel = mongoose.model(cartCollection,cartSchema)

export default cartModel