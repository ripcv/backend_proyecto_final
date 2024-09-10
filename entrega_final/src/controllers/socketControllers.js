import { logger } from "../logger/logger.js";
import * as ChatServices from "../services/chatService.js";

const socketController = async (socket) => {
  logger.info("Nuevo cliente conectado");

  //Obtenemos los mensajes existentes en la db
  try {
    const message = await ChatServices.getAllChats();
    socket.emit("messageLogs", message);
  } catch (err) {
    logger.error("Error al buscar mensajes", err);
  }

  //Guardamos mensajes nuevos
  socket.on("message", async (data) => {
    try {
      const newMessage = await ChatServices.saveChat(data);
      socket.emit("message", newMessage);
      socket.broadcast.emit("message", newMessage);
    } catch (error) {
      logger.error("Error al gudar el mensaje", error);
    }
  });
};

export default socketController;
