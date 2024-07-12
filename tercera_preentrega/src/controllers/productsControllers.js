import { isAdmin } from "../middleware/role.js";
import * as ProductService from "../services/productsService.js";

export async function getAllProducts(req, res) {
  let { limit = 10, page = 1, sort, query} = req.query;
  limit = parseInt(limit);
  page = parseInt(page);
  try {
    const products = await ProductService.getAllProducts(
      limit,
      page,
      sort,
      query,
    );
    const isAdmin = req.session.user.role === "admin";
    products.payload.forEach((product) => {
      product.isAdmin = isAdmin;
    });

    return res.render("products", {
      products: products,
      user: req.session.user,
      isAdmin: req.session.user.role === "admin",
      cart: req.session.user.cartId,
      pageProducts: "true",
    });
  } catch (error) {
    console.log(error);
  }
}
export async function getProductById(req, res) {
  let { pid } = req.params;
  try {
    const product = await ProductService.getProductById(pid);
    res.send({ result: "success", payload: product });
  } catch (error) {
    res.send({ status: "error", error: "Producto no encontrado" });
  }
}

export async function renderProductForm(req, res) {
  const pid = req.params.pid;
  let product = null;
  if (pid) {
    try {
      product = await ProductService.getProductById(pid);
      if (!product) {
        return res.status(404).send("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al cargar el producto:", error);
      return res.status(500).send("Error al cargar el producto");
    }
  }

  res.render("productForm", { product });
}
export async function createProduct(req, res) {
  const productData = req.body;
  if (!productData) {
    res.send({ status: "error", error: "Error en los datos ingresados" });
  }
  try {
    await ProductService.createProduct(productData);
    return res.status(200).json({
      success: true,
      message: "Producto agregado exitosamente",
    });
  } catch (error) {
    res.send({ result: "error", payload: "Error en crear el producto" });
  }
}

export async function updateProduct(req, res) {
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

export async function deleteProduct(req, res) {
  let pid = req.params;
  try {
    let result = await ProductService.deleteProduct(pid);
    res.send({ result: "success", payload: result });
  } catch (error) {
    res.send({ result: "Error", payload: "Error al eliminar producto" });
  }
}
