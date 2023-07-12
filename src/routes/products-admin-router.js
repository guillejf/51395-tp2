import express from "express";
import { productService } from "../services/products.service.js";
export const productsAdminRouter = express.Router();
import { checkUser } from "../utils/checkAuth.js";

productsAdminRouter.get("/", checkUser, async (req, res) => {
  try {
    const data = await productService.getAll({});
    const dataParse = data.map((prod) => {
      return {
        id: prod._id,
        title: prod.title,
        description: prod.description,
        price: prod.price,
        thumbnail: prod.thumbnail,
        code: prod.code,
        stock: prod.stock,
      };
    });
    const title = "Administrador de Productos";
    return res.status(200).render("products-admin", { dataParse, title });
  } catch (err) {
    console.log(err);
    res
      .status(501)
      .send({ status: "error", msg: "Error en el servidor", error: err });
  }
});
