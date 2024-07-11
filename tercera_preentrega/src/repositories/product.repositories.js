import productModel from "../dao/models/product.model.js";

class ProductRepository {
    constructor(productModel) {
        this.productModel = productModel
    }

    async createProduct(newProduct) {

    }

    async getAllProducts(filter,options) {
        const products = await productModel.paginate(filter,options)
        return products
    }

    async getCategories() {
        const categories = await productModel.distinct('category');
        return categories
    }

    
}

export default ProductRepository