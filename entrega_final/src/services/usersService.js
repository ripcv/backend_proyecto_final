import userModel from "../dao/models/users.model.js";
import { isValidPassword, sendMailDeleteUser } from "../utils.js";
import UserDto from "../dto/user.dto.js";
import UserRepository from "../repositories/user.repositories.js";
import { addCartToUser } from "../utils.js";
import { logger } from "../logger/logger.js";

const userRepository = new UserRepository(userModel);

export async function createUser(newUser) {
  try {
    const [user] = await userRepository.findUser({ email: newUser.email });
    if (user) {
      logger.warning("El usuario ya existe");
      return { success: false, message: "El usuario ya existe" };
    }
    const result = await userRepository.createUser(newUser);
    return { success: true, data: result };
  } catch (error) {
    throw new Error("Error al crear el usuario: " + error.message);
  }
}

export async function loginFindUser(username, password) {
  try {
    const [user] = await userRepository.findUser({ email: username });
    if (!user) {
      return false;
    }
    if (!isValidPassword(user, password)) return false;
    const userDTO = new UserDto(
      user._id,
      user.first_name,
      user.last_name,
      user.email,
      user.age,
      user.role,
      user.cartId ? user.cartId._id : null,
      user.documents ? user.documents : null,
      user.last_connection
    );
    const newCartId = await addCartToUser(user._id);
    if (newCartId) userDTO.cartId = newCartId;
    await updateUser(user._id, { last_connection: new Date() });
    return userDTO;
  } catch (error) {
    return "Error al validar usuario" + error;
  }
}

export async function getAllUsers() {
  try {
    const users = await userRepository.getAllUsers();
    if (!users) return false;
    return users;
  } catch (error) {}
}

export async function getUserById(userId) {
  const user = await userRepository.findUser({ _id: userId });
  if (!user) {
    return false; //se debe mejorar el return
  }
  return user;
}

export async function updateUser(userID, updates) {
  try {
    const userUpdate = await userRepository.updateUser(userID, updates);
    if (!userUpdate) {
    }

    return true;
  } catch (error) {}
}

export async function deleteUsers(uid) {
  try {
    const deleteUser = await userRepository.deleteUsers({ _id: uid });
    return true;
  } catch (error) {}
}

export async function deleteUsersByLastLogin() {
  const lastLogin = new Date();
  lastLogin.setDate(lastLogin.getDate() - 2);
  console.log(lastLogin);
  try {
    //Solo traemos los usuarios que no son administradores
    const users = await userRepository.findUser({
      last_connection: { $lt: lastLogin },
      role: { $ne: "admin" },
    });
    if (users) {
      //enviamos el mail y eliminamos el usuario
      for (const user of users) {
        try {
          await sendMailDeleteUser(user.email);
          await userRepository.deleteUsers({ _id: user._id });
        } catch (error) {
          throw error;
        }
      }
      return users.length;
    }
    //si no se encontro ningun usuario retornamos false
    return false;
  } catch (error) {
    throw error;
  }
}
