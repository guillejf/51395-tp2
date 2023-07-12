import express from "express";
import { cartService } from "../services/carts.service.js";

export const cartsRouter = express.Router();

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartService.get(cartId);
    console.log(cart);
    const plainCart = cart.products.map((doc) => doc.toObject());
    console.log(plainCart);
    res.status(200).render("carts", { plainCart });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
