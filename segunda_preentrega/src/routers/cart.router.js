import { Router } from "express";
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js"

const router = Router();

router.get('/', async(req, res) => {
    try {
        let carts =  await cartModel.find()
        if (carts.length === 0){
            res.send({ status: "error", error: "No existen carritos aun" })
        }
        res.send({ result: "success" , payload: carts})
    } catch (error) {
        console.log(error)
    }
})

router.get('/:cid', async(req, res) => {
    let { cid } = req.params
    try {
        let cart = await cartModel.findOne({ _id: cid }).populate({
            path:'products.product',
            select:'title price'
        }).lean();
      if(!cart){
        res.send({ status: "error", error: "Carrito no existe" })
        return
      }
        res.render('carts',{cart,cid})
    }catch(error){
        res.send({ status: "error", error: "Carrito no existe" })
    }
})

router.post('/', async (req, res) => {
    let { products = [] } = req.body;
    //asignamos el valor del id proveniente del formulario
    let product = req.body.product
    try {
        if (products.length === 0 && !product) {
            let result = await cartModel.create({});
            return res.send({ result: "success", payload: result });
        }
        if(product){
            products = [{
                product:product
            }]
        }
        console.log(products)
        let total = 0;
        let productWithPrices = []
        for (let i = 0; i < products.length; i++) {
            let product = products[i];
            let productPrice = await productModel.findOne({ _id: product.product }).select("price");
            if(!productPrice){
               return  res.status(400).send({status: "error", error: `Producto con ID ${product.product} no encontrado`})
            }
            let price = productPrice.price
            let quantity = product.quantity ?  product.quantity : 1
            let totalProduct = price * quantity
            productWithPrices.push({
                product: product.product,
                quantity: quantity,
                price: price
            })
            total += totalProduct
        }
        let result = await cartModel.create({ products: productWithPrices, total: total });
        res.send({ result: "success", payload: result });

    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Error en el servidor" });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params; 
    let quantity = req.body.quantity; 
  
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      quantity = 1
    }
    
    try {
        //Verificamos si el carrito existe.
        const cartExist = await cartModel.findById({_id:cid});
        if(!cartExist){
            return res.status(400).send({ status: 'error', error: `Carrito con ID ${cid} no encontrado` });
        }

      //verificamos si el producto esta en el carrito
      const productInCart = await cartModel.findOne({ _id: cid, 'products.product': pid });
      if(productInCart){
        //Si existe se actualiza la cantidad
        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cid }, 
            { $set: { 'products.$[product].quantity': quantity } },
            { new: true, arrayFilters: [{ 'product.product': pid }] } 
          );
      }else{
        // Si no existe se agrega
        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cid }, 
            { $push: { products: {product:pid, quantity } }},
            { new: true } 
          );
      }

      //se actualiza el total del carrito
        let findCart = await cartModel.findOne({_id:cid}).populate({
        path:'products.product',
        select:'price'
    }) 
    let updateTotal = 0
    let currentTotal = 0
    let total = 0
    findCart.products.forEach(product => {
        if(product.product.id===pid){
            updateTotal = product.product.price * product.quantity
        }else{
            currentTotal = product.product.price * product.quantity
        }
        total = updateTotal + currentTotal
    });
    const updatedCartWithTotal = await cartModel.findByIdAndUpdate(
        cid,
        { $set: { total } },
        { new: true }
    ); 

      res.send({ result: 'success', payload: updatedCartWithTotal });
    } catch (error) {
      res.status(500).send({ status: 'error', error: 'Error actualizando el carrito' });
    }
  });

//Elimina el contenido del carrito seleccionado
router.delete('/:cid/', async(req, res) => {
    let { cid } = req.params
    let result = await cartModel.findByIdAndUpdate({ _id: cid },{products:[],total:0},{new: true})
    res.send({ result: "success", payload: result })
})

//Elimina el contenido del carrito seleccionado
router.delete('/:cid/products/:pid', async(req, res) => {
    let { cid , pid} = req.params
    try {
        const cartExist = await cartModel.findById({_id:cid});
        if(!cartExist){
            return res.status(400).send({ status: 'error', error: `Carrito con ID ${cid} no encontrado` });
        }
        
        const productInCart = await cartModel.findOne({ _id: cid, 'products.product': pid });
        if (!productInCart) {
            return res.status(404).send({ status: 'error', error: `Producto con ID ${pid} no encontrado en el carrito` });
        }
        const updateCart = await cartModel.findOneAndUpdate(
            {_id: cid},
            {$pull:{products: {product:pid}}},
            {new:true}
        )
       
        // Calculamos nuevamente el total
        const findCart = await cartModel.findOne({ _id: cid }).populate({
            path: 'products.product',
            select: 'price'
        });

        let total = 0;
        findCart.products.forEach(product => {
            total += product.product.price * product.quantity;
        });

        const updatedCartWithTotal = await cartModel.findByIdAndUpdate(
            cid,
            { $set: { total } },
            { new: true }
        );

        res.send({ result: 'success', payload: updatedCartWithTotal });
    } catch (error) {
        
    }
})


export default router