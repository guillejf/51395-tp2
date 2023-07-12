import express from "express";
import { cartService } from "../services/carts.service.js";

export const cartsApiRouter = express.Router();

cartsApiRouter.get("/", async (req, res) => {
  try {
    const cart = await cartService.getAll();
    res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

cartsApiRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartService.get(cartId);
    res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

cartsApiRouter.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    const newCart = await cartService.createOne({ products });
    res.status(200).json({
      status: "success",
      payload: newCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cartsApiRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.addProductToCart(cid, pid);
    res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

cartsApiRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.removeProduct(cid, pid);
    res
      .status(200)
      .json({ status: "success", message: "Product removed from cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

cartsApiRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await cartService.clearCart(cid);
    res
      .status(200)
      .json({ status: "success", message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

cartsApiRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await cartService.updateCart(cid, products);
    res
      .status(200)
      .json({ status: "success", message: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

cartsApiRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateProductQuantity(cid, pid, quantity);
    res
      .status(200)
      .json({ status: "success", message: "Product quantity updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});
