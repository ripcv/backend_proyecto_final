import UserDto from "../../dto/user.dto.js";
import { upload, uploadPromise } from "../../middleware/upload.js";
import * as UserService from "../../services/usersService.js";

class ApiUserController {
  async createUser(newUser) {
    try {
      const result = await UserService.createUser(newUser);
      return result;
    } catch (error) {
      if (process.env.TEST_ENV) {
        throw new Error("Error al crear el usuario: " + error.message);
      }
      return res.redirect("/register");
    }
  }

  async loginFindUser(username, password) {
    try {
      const result = await UserService.loginFindUser(username, password);
      return result;
    } catch (error) {
      // return res.redirect("/login");
    }
  }

  async getAllUsers(req, res) {
    const users = await UserService.getAllUsers();
    if (!users)
      return res
        .status(400)
        .json({ status: "error", message: "error al obtener el usuario" });

    const userDtos = users.map((user) => ({
      id: user._id,
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    }));

    return res.status(200).json({
      status: "success",
      message: "usuarios obtenidos correctamente",
      payload: userDtos,
    });
  }

  async getUserById(req, res) {
    const userID = req.params.uid;
    const user = await UserService.getUserById(userID);

    if (!user)
      return res
        .status(400)
        .json({ status: "error", message: "error al obtener el usuario" });
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

    res.status(200).json({ status: "success", payload: userDTO });
  }

  async updateUser(reqOrUserID, updateOrRes, res = null) {
    let userID, updates;

    // Manejo de parámetros
    if (typeof reqOrUserID === "object" && reqOrUserID.hasOwnProperty("body")) {
      const req = reqOrUserID;
      res = updateOrRes;
      userID = req.params.uid;
      updates = req.body;
    } else {
      userID = reqOrUserID;
      updates = updateOrRes;
    }

    // Validación de parámetros
    if (!userID || !updates || Object.keys(updates).length === 0) {
      const errorMessage = {
        status: "error",
        message: "Faltan parámetros necesarios.",
      };
      if (res) {
        return res.status(400).json(errorMessage);
      } else {
        return errorMessage;
      }
    }

    // Actualización de usuario
    const update = await UserService.updateUser(userID, updates);

    if (!update) {
      const errorMessage = {
        status: "error",
        message: "Error al actualizar el usuario.",
      };
      if (res) {
        return res.status(400).json(errorMessage);
      } else {
        return errorMessage;
      }
    }

    const successMessage = {
      status: "success",
      message: "Usuario Actualizado",
    };

    // Responder según el contexto
    if (res) {
      return res.status(200).json(successMessage);
    } else {
      return successMessage;
    }
  }

  async uploadDocuments(req, res) {
    const user = await UserService.getUserById(req.user.id);
    if (user.role === "premium") {
      return res
        .status(400)
        .json({ status: "error", message: "Usuario ya es premium" });
    }
    await uploadPromise(req, res, upload.any());

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Error al subir los archivos" });
    }

    const documents = req.files.map((file) => ({
      name: file.fieldname,
      reference: file.filename,
    }));

    const result = await UserService.updateUser(req.user.id, {
      documents,
    });

    if (!result) {
      req.flash("error", "No se pudo actualizar los permisos");
    } else {
      req.flash(
        "success",
        "Archivos subidos correctamente, los archivos seran verificados y una vez aprobados se actualizara su cuenta"
      );
    }
    res.redirect("/profile");
  }

  async updatepremium(req, res) {
    const userID = req.params.uid;
    const user = await UserService.getUserById(userID);
    if (user) {
      if (user.documents.length != 0 && req.body.role) {
        const update = await UserService.updateUser(userID, {
          role: req.body.role,
        });
        if (!update)
          res.status(400).json({
            status: "error",
            message: "Error al actualizar el usuario.",
          });
        if (req.body.role === "user")
          await UserService.updateUser(userID, { documents: [] });
        return res
          .status(200)
          .json({ status: "success", message: "Cambio de rol exitoso." });
      } else {
        return res.status(400).json({
          status: "error",
          message: "Usuario no ha subido los Documentos requeridos.",
        });
      }
    }
    return res.status(400).json({
      status: "error",
      message: "Error al actualizar el usuario.",
    });
  }

  async deleteUsersByLastLogin(req, res) {
    
    const result = await UserService.deleteUsersByLastLogin();
    if (result === 0)
     return res.status(400).json({
        status: "error",
        message:
          "Error al eliminar o no existen usuarios que cumplen el criterio.",
      });

    res.status(200).json({
      status: "success",
      message: "Usuarios eliminados con exito",
    });
  }

  async deleteUser(req, res) {
    const uid = req.params.uid;
    const result = await UserService.deleteUsers(uid);
  }
}
export default ApiUserController;
