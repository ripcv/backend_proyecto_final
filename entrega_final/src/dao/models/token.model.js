import mongoose from "mongoose";

const tokenCollection = 'Token'

const tokenSchema = new mongoose.Schema({
    userID : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    token : {
        type: String,
        required: true
    },
    createAt : {
        type: Date,
        default: Date.now,
        expires: 3600
    }
})


const tokenModel = mongoose.model(tokenCollection,tokenSchema)

export default tokenModel