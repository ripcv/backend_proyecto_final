import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcryptjs'
import cartModel from './dao/models/cart.model.js'
import userModel from './dao/models/users.model.js'
import nodemailer from 'nodemailer'
const __filename = fileURLToPath(import.meta.url)


export const __dirname = dirname(__filename)

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

//Funcion para verfificar si existe un cartId asignado al usuario

export const addCartToUser = async (userId) => {
    try {
        const updateUser = await userModel.findById(userId)
        if (!updateUser.cartId) {
            const newCart = new cartModel();
            await newCart.save();
            updateUser.cartId = newCart._id;
            await updateUser.save();
        }
        return updateUser.cartId
    } catch (error) {
        console.error('Error al agregar el carrito al usuario:', err);
        throw err;
    }

}

export const codeTicketGenerator = async (cartId) => {
    const lastFourDigits = cartId.toString().slice(-2);
    const currentDate = new Date();
    const formattedTime = currentDate.toTimeString().slice(0, 8).replace(/:/g, '');
    return `CP${lastFourDigits}${formattedTime}`
}

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "gefallene.engel@gmail.com",
        pass: "uyov bbir zwgf ddar"
    }
})


export async function sendMail(email, ticket) {

    let result = await transport.sendMail({
        from: "Compra Exitosa <gefallene.engel@gmail.com>",
        to: email,
        subject: `Orden ${ticket.code}`,
        html: `
    <div>
     <h1>Orden completada</h1>
     <p> Se realizo una compra por: ${ticket.amount} </p>
    </div>
    `,
    })

}