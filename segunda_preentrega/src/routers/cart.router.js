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

    try {
        if (products.length === 0) {
            let result = await cartModel.create({});
            return res.send({ result: "success", payload: result });
        }

        let total = 0;
        for (let i = 0; i < products.length; i++) {
            let product = products[i];
            let productPrice = await productModel.findOne({ _id: product.product }).select("price");

            if (productPrice) {
                let price = productPrice.price;
                if (product.quantity) {
                    total += price * product.quantity;
                } else {
                    total += price;
                }
            } else {
                return res.send({ status: "error", error: `Producto con ID ${product.product} no existe` });
            }
        }

        let result = await cartModel.create({ products, total });
        res.send({ result: "success", payload: result });

    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Error en el servidor" });
    }
});


router.put('/:cid', async(req,res)=> {
    let {cid} = req.params
    let cartToReplace = req.body
    if(!cartToReplace){
        res.send({ status: "error", error: "Debe actualizar por lo menos un registro" })
    }
    res.send('Put request to the homepage')
    let result = await cartModel.updateOne({_id :cid}, cartToReplace)
    res.send({ result: "success", payload: result })
})


router.delete('/:cid', async(req, res) => {
    let { cid } = req.params
    let result = await cartModel.deleteOne({ _id: cid })
    res.send({ result: "success", payload: result })
})

export default router