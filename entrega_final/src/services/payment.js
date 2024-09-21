import Stripe from "stripe";

export default class PaymentService {
    constructor(){
        this.stripe = new Stripe(process.env.STRIPE_SK)
    }

    createPaymentIntent = async (data) => {
        try {
        const paymentIntent = this.stripe.paymentIntents.create(data)
            return paymentIntent
        } catch (error) {
            throw error
        }
    }
}