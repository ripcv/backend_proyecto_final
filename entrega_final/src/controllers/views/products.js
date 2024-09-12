import * as ProductService from "../../services/productsService.js"
import * as UserService from "../../services/usersService.js"
class ViewProductController{
    async getAllProducts(req, res){
        const products = await ProductService.getAllProducts(req.query);
        return res.render("products", {
            products: products, 
            ...(req.session.user && { user: req.session.user }),
            pageProducts: "true",
          });
    }

    //vista para crear y editar productos
    async renderProductForm(req, res) {
        const pid = req.params.pid;
        let product = null;
        if (pid) {
          try {
            product = await ProductService.getProductById(pid);
            if (!product) {
              return res.status(404).send("Producto no encontrado");
            }
          } catch (error) {
            logger.error("Error al cargar el producto:", error);
            return res.status(500).send("Error al cargar el producto");
          }
        }

        const [owner] = await UserService.getUserById(product.owner.toString())
        res.render("productForm", { product , owner: owner.email });
      }
}

export default ViewProductController