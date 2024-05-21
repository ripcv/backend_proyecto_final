import { Router } from "express";
import cartModel from "../dao/models/cart.model.js";

const router = Router();

router.get('/', async(req, res) => {
    try {
        let carts =  await cartModel.find()
        res.send({ result: "success" , payload: carts})
    } catch (error) {
        console.log(error)
    }
})

router.get('/:cid', async(req, res) => {
    let { cid } = req.params
    try {
        let cart =  await cartModel.findOne({_id:cid})
        res.send({ result: "success" , payload: cart})
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async(req, res)=> {
    let {user, products} = req.body
    if(!user || !products){
        res.send({ status: "error", error: "Faltan parametros"})
    }
    let result = await cartModel.create({user, products})
    res.send({ result: "success", payload: result })
})

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