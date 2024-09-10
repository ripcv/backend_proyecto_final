import { Router } from "express";
import { mockingProducts } from "../utils.js";
import CustomError from "../services/errors/CustomError.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";


const router = Router()

router.get("/", async (req,res)=>{
    const products = await mockingProducts()
    return res.render("products", {
        products: products,
        user: req.session.user,
        isAdmin: req.session.user.role === "admin",
        cart: req.session.user.cartId,
        pageProducts: "true",
      });

})

router.post('/', (req,res) => {
  const {first_name, last_name, age, email} = req.body
  if(!first_name || !last_name || !age || !email){
      CustomError.createError({
          name:"User creation error",
          cause: generateUserErrorInfo({first_name, last_name, age, email}),
          message: "Error trying to create User",
          code: EErrors.INVALID_TYPES_ERROR
      })
  }

  const user = {
      first_name, last_name, age, email
  }

  if(users.length===0){
      user.id=1
  }else{
      user.id = users[users.length-1].id+1
  }

  users.push(user)
  res.send({status:"success", payload:user})
})

export default router