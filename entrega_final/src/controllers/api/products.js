import * as ProductService from "../../services/productsService.js";
import * as UserService from "../../services/usersService.js";
import { logger } from "../../logger/logger.js";
import { sendMailDeleteProduct } from "../../utils.js";

class ApiProductsController {
  async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts(req.query);
      return res.status(200).json({ result: "success", payload: products });
    } catch (error) {
      logger.error(`Error al obtener los productos ${error}`);
    }
  }

  async getProductById(req, res) {
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
    const { pid } = req.params;
    const productToReplace = req.body;
    let updateProduct = {};
    if (!productToReplace || Object.keys(productToReplace).length === 0) {
      return res.send({
        status: "error",
        error: "Debe actualizar por lo menos un registro",
      });
    }
    try {
    const [user] = await UserService.getUserById(productToReplace.ownerId);
    if (productToReplace.owner != user.email) {
      const [newOwner] = await UserService.findUser({
        email: productToReplace.owner,
      });
      if (!newOwner) {
        return res.send({
          status: "error",
          message: "El usuario ingresado como owner no existe",
        });
      } else if (newOwner.role === "user") {
        return res.send({
          status: "error",
          message: "El usuario ingresado no tiene privilegios para ser Owner",
        });
      } else {
        updateProduct = {
          ...productToReplace,
          owner: newOwner._id,
        };
        delete updateProduct.ownerId;
      }
    }

      let result = await ProductService.updateProduct(pid, updateProduct);
      return res.send({
        status: "success",
        payload: result,
        message: "Producto actualizado correctamente",
      });
    } catch (error) {
      res.send({ result: "Error", payload: "Error al actualizar producto" });
    }
  }

  async deleteProduct(req, res) {
    let pid = req.params;

    try {
      const product = await ProductService.getProductById({ _id: pid.pid });
      const [user] = await UserService.getUserById(product.owner);
      if (user && product) {
        await sendMailDeleteProduct(user.email, product.title);
      }
      let result = await ProductService.deleteProduct(pid);
      res.send({ result: "success", payload: result });
    } catch (error) {
      res.send({ result: "Error", payload: "Error al eliminar producto" });
    }
  }
}

export default ApiProductsController;
