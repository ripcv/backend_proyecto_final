import { Router } from "express";
import productModel from "../dao/models/product.model.js";

const router = Router();

router.get('/', async(req, res) => {
    let  { limit = 10 , page = 1 ,sort, query } = req.query;
    limit = parseInt(limit)
    page = parseInt(page)
    try {
        let filter = {}
        if(query){
            filter = {
                $or : [
                    { category: query},
                    { status: query.toLowerCase()==='true'}
                ]
            }
        }

        let sortOptions = {}
        if(sort){
            sortOptions.price = sort === 'asc' ? 1 : -1
        }

        const options = {
            lean: true,
            page: page,
            limit: limit,
            sort: sortOptions
        }
        
        const products = await productModel.paginate(filter,options)
        const categories = await productModel.distinct('category');

        //se crea variable result solicitada en la consigna
        const results = {
            status: "success0",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: `/api/products?limit=${products.limit}&page=${products.prevPage}${sort ? `&sort=${sort}`: ""}${query ? `&query=${query}` : ""}`,
            nextLink: `/api/products?limit=${products.limit}&page=${products.nextPage}${sort ? `&sort=${sort}`: ""}${query ? `&query=${query}` : ""}`
        }


        res.render('products',{results,categories})
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