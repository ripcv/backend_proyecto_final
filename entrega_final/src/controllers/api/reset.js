import {
  randomeToken,
  createHash,
  isValidPassword,
  sendMailToken,
} from "../../utils.js";
import userModel from "../../dao/models/users.model.js";
import UserRepository from "../../repositories/user.repositories.js";
import {
  saveToken,
  deleteToken,
  findToken,
} from "../../services/resetService.js";
import ApiUserController from "./users.js";

const userRepository = new UserRepository(userModel);
const ApiUser = new ApiUserController();

export async function resetPassword(req, res) {
  const email = req.body.email;
  const user = await userRepository.findUser({ email: email });
  if (!user) {
    req.flash("error", "Correo ingresado no valido");
    return res.redirect("/reset_password");
  }
  const token = randomeToken();
  if (saveToken(user._id, token)) {
    const url = `localhost:8080/change_password?token=${token}&id=${user._id}`;
    sendMailToken(email, url);
    //se deja url por consola en caso de usar un correo que no exista
    console.log(url);
    req.flash("success", "Link de recuperacion enviado");
    res.redirect("/");
  }
}

export async function changePassword(req, res) {
  const userID = req.body.userID;
  const password = req.body.password;
  const user = await userRepository.findUser({ _id: userID });
  if (isValidPassword(user, password)) {
    const result = await findToken(userID);
    req.flash("error", "No se puede utilizar la misma contraseña");
    res.redirect(`/change_password?token=${result.token}&id=${userID}`);
  } else {
    const userUpdate = await ApiUser.updateUser(userID, {
      password: createHash(password),
    });
    if (userUpdate) {
      await deleteToken(userID);
      return res.redirect("/");
    }
  }
}
