import fs from 'fs/promises'


class ProductManager {
    constructor() {
        this.path = "./desafio_cuatro/src/products.json"
    }

    async getProducts() {
        try {
            const product = await fs.readFile(this.path, 'utf-8')
            return JSON.parse(product)
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                throw error
            }
        }
    }
    // Creamos una funcion para guardar los productos.
    async saveProducts(products){
        await fs.writeFile(this.path, JSON.stringify(products, null, 2))
    }

    async addProduct(producto) {
        try {
          const products = await this.getProducts();
          // Filtramos que el producto "codigo" no este creado
          const productExists = products.find((p) => p.code === producto.code);
          if (productExists) {
            console.log('El producto ya se encuentra ingresado.');
            return;
          }
          const lastId = Math.max(...products.map((p) => p.id),0);
          producto.id = lastId + 1;

          products.push(producto);
          await this.saveProducts(products);
          console.log('Producto se ha creado correctamente.');
        } catch (error) {
          console.error('Error al crear el producto:', error);
        }
      }
 
    async getProductsById(id) {
        try {
            console.log("Buscando producto...")
            const products = await this.getProducts()
            const producto_encontrado = await products.find((p) => p.id === id)
            if (!producto_encontrado) {
                console.log("Producto no se encuentra creado")
                return 
            }
            console.log("Producto Encontrado", producto_encontrado)
                return

        } catch (error) {
            console.error("Error al buscar el producto", error)
            return []
        }
    }

    async updateProduct(id,datos) {
        try {
            const products = await this.getProducts()
            console.log("Actualizando producto...")
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                console.log("No se pudo actualizar, el producto no existe") 
                return
              }

              // Filtramos que los datos vacios no sobreescriban los existentes
             const updateProduct = { ...products[productIndex] }
             for (const key in datos){
                if (datos[key] !== undefined && datos[key] !== ""){
                    updateProduct[key] = datos[key];
                }
             }
             products[productIndex] = updateProduct;
            await this.saveProducts(products)
            console.log("Producto Actualizado Correctamente")
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts()
            console.log("Eliminando producto...")
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                console.log("No se pudo eliminar, el producto no existe")
                return
              }
            products.splice(productIndex,1)
            await this.saveProducts(products)
            console.log("Producto Eliminado con Exito")
            return 
        } catch (error) {
        console.error("Error al eliminar el producto:", error);
        }
    }
}

export default ProductManager