import chatModel from "../dao/models/chat.model.js";

export async function getAllChats(){
    const messages = await chatModel.find({})
    return messages
}

export async function saveChat(newMessage){
    try {
        if(!newMessage){
           return null
        }
        const message = new chatModel(newMessage)
        return await message.save()

    } catch (error) {
        
    }
}