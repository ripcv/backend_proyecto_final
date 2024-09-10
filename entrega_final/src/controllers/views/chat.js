import * as ChatServices from "../../services/chatService.js"

class ViewChatController{
    async getAllChats(req, res) {
        try {
          const chat = await ChatServices.getAllChats();
          if (!chat) return chat;
          res.render("chat", { chat: chat, user: req.session.user ,pageChat: "true"});
        } catch (error) {
          res.send({ status: "error", error: "Error la obtención de los mensajes" });
        }
    }
    async saveChat(req, res) {
        const newMessage = new chatModel(req.body);
        await ChatServices.saveChat(newMessage);
      }
}

export default ViewChatController