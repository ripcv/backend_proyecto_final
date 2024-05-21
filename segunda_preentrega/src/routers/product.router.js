import { Router } from "express";
import productModel from "../dao/models/product.model.js";

const router = Router();

router.get('/', async(req, res) => {
    let  limit  = parseInt(req.query.limit)
    try {
        let products = await productModel.find().lean().limit(limit ? limit : 10);
        console.log(products)
        res.render('products',{products})
    } catch (error) {
        console.log(error)
    }
})

router.get('/:pid', async(req, res) => {
    let { pid } = req.params
    try {
        let product = await productModel.findOne({_id:pid})
        res.send({ result: "success" , payload: product})
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async(req, res)=> {
    let {title, description, code, price,stock,category,thumbnail,status=true} = req.body
    if(!title || !description || !code || !price || !stock || !category ){
        res.send({status: "error", error: "Ingrese todo los campos requeridos"})
    }
    let result = await productModel.create({title,description,code,price,stock,category,thumbnail,status})
    res.send({ result: "success", payload: result })
})

router.put('/:pid', async(req,res)=> {
    let {pid} = req.params
    let productToReplace = req.body
    if(!productToReplace){
        res.send({ status: "error", error: "Debe actualizar por lo menos un registro" })
    }

    let result = await productModel.updateOne({_id :pid}, productToReplace)
    res.send({ result: "success", payload: result })
})

router.delete('/:pid', async(req, res) => {
    let { pid } = req.params
    let result = await productModel.deleteOne({ _id: pid })
    res.send({ result: "success", payload: result })
})


export default router