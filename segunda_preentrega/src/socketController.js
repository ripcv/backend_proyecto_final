import messageModel from "./dao/models/message.model.js";


const socketController = (socket) => {
    console.log("Nuevo cliente conectado")

    //Obtenemos los mensajes existentes en la db
    messageModel.find({},(err, messages) => {
        if(err) {
            console.error("Error al buscar mensajes:".err)
        return
    }
    socket.emit('messageLogs', messages)
    })

    //Guardamos mensajes nuevos
    socket.on('message', async (data) => {
        try {
            const newMessage = new messageModel(data);
            if(!newMessage){
                console.log("No se puede guardar mensajes vacios")
                return
            }
            await newMessage.save()
            socket.emit('message', newMessage);

        } catch (error) {
            console.error("Error al gudar el mensaje", error)
        }
    })
}

export default socketController