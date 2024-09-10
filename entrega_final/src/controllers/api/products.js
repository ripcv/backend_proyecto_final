import * as ProductService from "../../services/productsService.js";
import { logger } from "../../logger/logger.js";

class ApiProductsController {
  async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts(req.query);
      return res.status(200).json({ result: "success", payload: products });
    } catch (error) {
      logger.error(`Error al obtener los productos ${error}`);
    }
  }

  async getProductById(req,res){
    let { pid } = req.params;
    try {
      const product = await ProductService.getProductById(pid);
      res.send({ result: "success", payload: product });
    } catch (error) {
      res.send({ status: "error", error: "Producto no encontrado" });
    }
  }

  async createProduct(req, res) {
    const productData = req.body;
    if (!productData) {
      res.send({ status: "error", error: "Error en los datos ingresados" });
    }
    try {
      if (req.user) {
        productData.owner = req.user.id;
      }
      const result = await ProductService.createProduct(productData);
      return res.status(200).json({
        success: true,
        message: "Producto agregado exitosamente",
        payload: result,
      });
    } catch (error) {
      res.send({ result: "error", payload: "Error en crear el producto" });
    }
  }

  async updateProduct(req, res) {
    let { pid } = req.params;
    let productToReplace = req.body;
    if (!productToReplace || Object.keys(productToReplace).length === 0) {
      return res.send({
        status: "error",
        error: "Debe actualizar por lo menos un registro",
      });
    }
    try {
      let result = await ProductService.updateProduct(pid, productToReplace);
      return res.send({ result: "success", payload: result });
    } catch (error) {
      res.send({ result: "Error", payload: "Error al actualizar producto" });
    }
  }

  async deleteProduct(req, res) {
    let pid = req.params;
    try {
      let result = await ProductService.deleteProduct(pid);
      res.send({ result: "success", payload: result });
    } catch (error) {
      res.send({ result: "Error", payload: "Error al eliminar producto" });
    }
  }
}

export default ApiProductsController;
