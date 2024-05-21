import express from 'express'
import mongoose from 'mongoose'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import productRouters from './routers/product.router.js'
import cartRouters from './routers/cart.router.js'
//import socketController from './socketController.js'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
dotenv.config()
console.log("Segunda Preentrega Proyecto Final")

const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, console.log(`Server running on port ${PORT}`))

const socketServer = new Server(httpServer)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URL)
.then(()=> {console.log("Conectado a la base de datos")})
.catch(error => console.error("Error en la conexion", error))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/api/products', productRouters)
app.use('/api/carts', cartRouters)

//socketServer.on('connection', socketController)

/* app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
}) */