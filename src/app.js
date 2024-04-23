console.log("Iniciando Proyecto")

const express = require('express')
const path = require("path")
const app = express()
const cartsRouter = require("./routes/carts.routers.js")
const productsRouter = require("./routes/products.routers.js")

const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(express.static(path.join(__dirname, 'public')))

app.use("/", cartsRouter)
app.use("/", productsRouter)

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
}) 