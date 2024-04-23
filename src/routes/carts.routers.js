const express = require("express")
const router = express.Router()
const fs = require('fs')
const cartPath = './src/carrito.json'

const carts = []

router.get("/carts", (req,res) => {
    res.json(carts)
})

router.post("/api/carts", (req,res) => {
    const newCart = req.body
    carts.push(newCart)
    res.json({message: "Producto agregado al carrito"})
})

module.exports = router