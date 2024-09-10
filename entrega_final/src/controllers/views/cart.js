import * as CartServices from "../../services/cartsService.js"

class ViewCartController{
   async getCartById(req,res){
      let { cid } = req.params;
      try {
        const cart = await CartServices.getCartById(cid);
        if (!cart) return false;
       res.render("carts", {
        cart,
        cid,
        user: req.session.user,
        isAdmin: req.session.user.role === "admin",
        pageCart: "true",
      });
      } catch (error) {
        res.send({
          status: "error",
          error: "Error en la obtencion de los productos",
        });
      }
   }
}

export default ViewCartController