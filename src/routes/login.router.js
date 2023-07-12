import express from "express";
export const loginRouter = express.Router();
import { userService } from "../services/users.service.js";
import passport from "passport";

loginRouter.get("/", async (req, res) => {
  try {
    const title = "Fuego Burgers® - Login";
    return res.status(200).render("login", { title });
  } catch (err) {
    console.log(err);
    res
      .status(501)
      .send({ status: "error", msg: "Error en el servidor", error: err });
  }
});

/* loginRouter.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    //isValidPassword
    const foundUser = await userService.findUserByEmailPassword(
      email,
      password
    );
    if (foundUser) {
      req.session.user = {
        _id: foundUser._id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        rol: foundUser.rol,
      };
      return res.redirect("/products");
    } else {
      return res.status(400).send({
        status: "error",
        msg: "Controle su email o su password.",
        error: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      status: "error",
      msg: "Error inesperado contacte a ... (email de la empresa)",
      error: {},
    });
  }
}); */

loginRouter.post(
  "/",
  passport.authenticate("login", { failureRedirect: "/" }),
  async (req, res) => {
    if (!req.user) {
      return res.json({ error: "invalid credentials" });
    }

    req.session.user = {
      _id: req.user._id.toString(),
      email: req.user.email,
      firstName: req.user.firstName,
      rol: req.user.rol,
    };

    return res.redirect("/products");

    //return res.json({ msg: "ok", payload: req.session.user });
  }
);
