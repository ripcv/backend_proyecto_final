const express = require("express")
const router = express.Router()
const fs = require('fs')
const productPath = './src/productos.json'
const products = []

//Funciones globales
function leerProductos(limit) {
    return new Promise((resolve, reject) => {
        fs.readFile(productPath, 'utf-8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    //si el archivo no existe se retorna un array vacio
                    return resolve([]);
                }
                console.error(err);
                return reject('Internal Server Error');
            }
            let products = JSON.parse(data);

            if (!isNaN(limit) && limit > 0) {
                products = products.slice(0, limit);
            }

            resolve(products);
        });
    });
}

function guardarProductos(products, res , msg){
    fs.writeFile(productPath, JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al guardar el producto' });
        }
            res.json({ message: msg });
    });
}

//Endpoints
// Leemos todos los productos con limite si existe
router.get("/products", async(req, res) => {
    try {
        let limit = parseInt(req.query.limit);
        const products = await leerProductos(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// producto especifico
router.get("/products/:pid", async(req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        const products = await leerProductos(0);
        const product = products.find((p)=> p.id === productId) ;
        console.log(product) 
        if(product){    
            res.json(product)
        }else{
            res.status(404).json({message: "Producto no encontrado"})
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

//Agregamos Productos
router.post("/api/products", async(req,res) => {
    const newProduct = req.body
    //validamos los campos el producto
    if (newProduct.title && newProduct.description && newProduct.code && newProduct.price && newProduct.stock && newProduct.category !== undefined) {
        //validamos que el producto code no este repetido
        const products = await leerProductos(0);
        const productExists = products.find((p) => p.code === newProduct.code);
          if (productExists) {
           return res.status(500).json({ error: 'El producto ya se encuentra ingresado' });
          }
        //Si el producto no esta repetido se ingresa
        const lastId = Math.max(...products.map((p) => p.id),0);
        newProduct.id = lastId + 1;
        newProduct.status = true
        products.push(newProduct)
        guardarProductos(products, res, "Producto Agregado")
    } else {
        res.json({ message: "Favor complete todos los campos requeridos" });
    }
    
})

//Modificamos un producto
router.put("/api/products/:pid", async(req,res) => {
    const newProduct = req.body
    const productId = parseInt(req.params.pid)

    //obtenemos el producto a modificar si existe
     const products = await leerProductos(0);
     const productIndex = products.findIndex((product) => product.id === productId);
     if (productIndex === -1) {
       return res.status(404).json({message: "Producto no encontrado"})
    }

     // Filtramos que los datos vacios no sobreescriban los existentes
     const updateProduct = { ...products[productIndex] }
     for (const key in newProduct){
        if (newProduct[key] !== undefined && newProduct[key] !== ""){
            updateProduct[key] = newProduct[key];
        }
     }
     products[productIndex] = updateProduct;
     guardarProductos(products,res,"Producto Actualizado")
    
})

module.exports = router