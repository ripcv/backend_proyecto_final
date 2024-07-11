import * as ChatServices from "../services/chatService.js";

const socketController = async (socket) => {
  console.log("Nuevo cliente conectado");

  //Obtenemos los mensajes existentes en la db
  try {
    const message = await ChatServices.getAllChats();
    socket.emit("messageLogs", message);
  } catch (err) {
    console.error("Error al buscar mensajes", err);
  }

  //Guardamos mensajes nuevos
  socket.on("message", async (data) => {
    try {
      const newMessage = await ChatServices.saveChat(data);
      socket.emit("message", newMessage);
      socket.broadcast.emit("message", newMessage);
    } catch (error) {
      console.error("Error al gudar el mensaje", error);
    }
  });
};

export default socketController;
