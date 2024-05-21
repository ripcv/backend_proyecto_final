const express = require("express")
const router = express.Router()
const fs = require('fs')
const carritoPath = './src/carritos.json'
const leerProductos = require('./products.routers').leerProductos
const carts = []


//Funciones globales
function leerCarts() {
    return new Promise((resolve, reject) => {
        fs.readFile(carritoPath, 'utf-8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    //si el archivo no existe se retorna un array vacio
                    return resolve([]);
                }
                console.error(err);
                return reject('Internal Server Error');
            }
            let carts = JSON.parse(data);
            resolve(carts);
        });
    });
}

function guardarCarts(carts, res , msg){
    fs.writeFile(carritoPath, JSON.stringify(carts, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al guardar el carrito' });
        }
            res.json({ message: msg });
    });
}


// Carrito especifico
router.get("/api/carts/:cid", async(req, res) => {
    try {
        const cartId = parseInt(req.params.cid)
        const carts = await leerCarts();
        const cart = carts.find((c)=> c.id === cartId) ;
        if(cart){
            const products = await leerProductos(0) 
            
            const cartProductInfo = cart.products.map((productCart)=>{
                const product = products.find((p) => p.id === productCart.id)
                if(product){
                    return{
                        id: product.id,
                        title: product.title,
                        quantity: productCart.quantity
                    }
                }
            })

            const productosEncontrados = cartProductInfo.filter((product) => product !== null)
            res.json({cart: cart.id, products: productosEncontrados})
        }else{
            res.status(404).json({message: "Carro no encontrado"})
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

//Creamos el carrito
router.post("/api/carts", async(req,res) => {
        const newCart = req.body || {}
        
        const lastId = Math.max(...carts.map((c) => c.id),0);
        newCart.id = lastId + 1;
           
        //si existen productos se agrega la cantidad que por defecto es 1 por producto
        if(newCart.products) {
            newCart.products.forEach(product => {
                product.quantity = 1;
            });    
        }
              
        carts.push(newCart)
        guardarCarts(carts, res, "Carrito Agregado")
       
       
})

//Agregamos producto a carrito existente
router.post("/api/carts/:cid/products/:pid", async(req,res) => {
    const productId = parseInt(req.params.pid)
    const cartId = parseInt(req.params.cid)
    const carts = await leerCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);
    if(cartIndex === -1){
        return res.status(404).json({message: "Carrito no encontrado"})
    }
    const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId)

    if(productIndex !== -1){
        carts[cartIndex].products[productIndex].quantity += 1
    }else{
        carts[cartIndex].products.push({id: productId, quantity: 1})
    }

    guardarCarts(carts, res, "Carrito Actualizado")
    
})

module.exports = router