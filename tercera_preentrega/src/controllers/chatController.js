import * as ChatServices from '../services/chatService.js'

export async function getAllChats(req, res) { 
    try {
        const chat = await ChatServices.getAllChats()
        if (!chat) return chat
        res.render('chat', { chat: chat , user:req.session.user.email})
    } catch (error) {
        res.send({ status: "error", error: "Error la obtención de los mensajes" });
    }
}

export async function saveChat(req, res) {
        const newMessage = new chatModel(req.body)
        await ChatServices.saveChat(newMessage)
}