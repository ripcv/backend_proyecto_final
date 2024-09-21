import { Router } from "express";
import PaymentService from "../../services/payment.js";
import ApiCartController from "../../controllers/api/cart.js";


const PaymentRouter = Router()
const ApiCart = new ApiCartController(

)
PaymentRouter.get('/payment-intents', async (req,res)=> {
    const productRequested = products.find(product => product.id === parseInt(req.query.id))
    if(!productRequested) return res.status(404).send({ status: "error" , message: "Producto no encontrado"})

        const paymentIntentInfo = {
            amount : productRequested.price,
            currency : 'clp'  ,
        }

        const service = new PaymentService()

        let result = await service.createPaymentIntent(paymentIntentInfo)
        res.send({status:"success", payload : result})
})

PaymentRouter.get('/success/:cid',ApiCart.successPurchase)

export default PaymentRouter