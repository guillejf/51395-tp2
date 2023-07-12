import express from "express";
export const registerRouter = express.Router();
import { userService } from "../services/users.service.js";
import passport from "passport";

registerRouter.get("/", async (req, res) => {
  try {
    const title = "Fuego Burgers® - Register";
    return res.status(200).render("register", { title });
  } catch (err) {
    console.log(err);
    res
      .status(501)
      .send({ status: "error", msg: "Error en el servidor", error: err });
  }
});

/* registerRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, age, password } = req.body;
    //TODO: 1
    if (!firstName || !lastName || !email || !age || !password) {
      return res.status(400).send({
        status: "error",
        msg: "Controle los datos ingresados",
        error: {},
      });
    }
    const userExist = await userService.findUserByEmail(email);
    //TODO: 1
    if (userExist) {
      return res.status(400).send({
        status: "error",
        msg: "El usuario ya existe!",
        error: {},
      });
    } else {
      const userCreated = await userService.create({
        firstName,
        lastName,
        email,
        age,
        password,
      });
      req.session.user = {
        _id: userCreated._id,
        email: userCreated.email,
        firstName: userCreated.firstName,
        rol: userCreated.rol,
      };
      return res.redirect("/products");
    }
  } catch (e) {
    //logger
    //TODO: 1
    console.log(e);
    return res.status(500).send({
      status: "error",
      msg: "Error inesperado contacte a ... (email de la empresa)",
      error: {},
    });
  }
}); */

registerRouter.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.user) {
      return res.json({ error: "something went wrong" });
    }
    console.log(req.user);
    req.session.user = {
      _id: req.user._id.toString(),
      email: req.user.email,
      firstName: req.user.firstName,
      rol: req.user.rol,
    };
    console.log(req.session);
    return res.redirect("/products");

    //return res.json({ msg: "ok", payload: req.user });
  }
);
