import productModel from "../dao/models/product.model.js";
import { isAdmin } from "../middleware/role.js";
import ProductRepository from "../repositories/product.repositories.js";

const productRepository = new ProductRepository(productModel)

export async function getAllProducts(limit,page,sort,query){
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
    
    const products = await productRepository.getAllProducts(filter,options)
    const categories = await productRepository.getCategories();

    //se crea variable result solicitada en la consigna
    const results = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: `/api/products?limit=${products.limit}&page=${products.prevPage}${sort ? `&sort=${sort}`: ""}${query ? `&query=${query}` : ""}`,
        nextLink: `/api/products?limit=${products.limit}&page=${products.nextPage}${sort ? `&sort=${sort}`: ""}${query ? `&query=${query}` : ""}`,
        categories: categories
    }
    return results
}

export async function getProductById(pid){
    const product = await productModel.findOne({_id:pid}).lean()
    return product
}

export async function createProduct(productData){
    const product = await productModel.create(productData)
    return product
}

export async function updateProduct(pid, productToReplace){
    let result = await productModel.updateOne({_id :pid}, productToReplace)
    return result
}

export async function deleteProduct(pid){
    let result = await productModel.deleteOne({ _id: pid.pid })
    return result
}