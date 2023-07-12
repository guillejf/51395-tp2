import express from "express";
import { userService } from "../services/users.service.js";
export const usersRouter = express.Router();
import { checkUser } from "../utils/checkAuth.js";

usersRouter.get("/", checkUser, async (req, res) => {
  try {
    const data = await userService.getAll({});
    const dataParse = data.map((user) => {
      return {
        id: user._id,
        email: user.email,
        username: user.username,
        password: user.password,
        rol: user.rol,
      };
    });
    const title = "Fuego Burgers® - Users";
    return res.status(200).render("users", { dataParse, title });
  } catch (err) {
    console.log(err);
    res
      .status(501)
      .send({ status: "error", msg: "Error en el servidor", error: err });
  }
});
