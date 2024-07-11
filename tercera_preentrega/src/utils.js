import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcryptjs'
import cartModel from './dao/models/cart.model.js'
import userModel from './dao/models/users.model.js'
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
    } catch (error) {
        console.error('Error al agregar el carrito al usuario:', err);
        throw err;
    }

}