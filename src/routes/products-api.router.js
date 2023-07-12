import express from "express";
import { productService } from "../services/products.service.js";
export const productsApiRouter = express.Router();

productsApiRouter.get("/", async (req, res) => {
  try {
    const { limit, pagina, category, orderBy } = req.query;
    const data = await productService.getAllWithPagination(
      limit,
      pagina,
      category,
      orderBy
    );
    const {
      totalDocs,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = data;
    res.status(200).json({
      status: "success",
      msg: `Mostrando los ${data.docs.length} productos`,
      payload: data.docs,
      totalDocs: totalDocs,
      totalPages: totalPages,
      prevPage: hasPrevPage ? prevPage : null,
      nextPage: hasNextPage ? nextPage : null,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: hasPrevPage
        ? `/api/products?limit=${data.limit}&pagina=${prevPage}`
        : null,
      nextLink: hasNextPage
        ? `/api/products?limit=${data.limit}&pagina=${nextPage}`
        : null,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Error en el servidor",
      payload: {},
    });
  }
});

productsApiRouter.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Por favor completa todos los campos");
      return res.status(400).json({
        status: "error",
        msg: "Por favor completa todos los campos",
        payload: {},
      });
    }
    const ProductCreated = await productService.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
    return res.status(201).json({
      status: "success",
      msg: "Producto Creado",
      payload: {
        _id: ProductCreated._id,
        title: ProductCreated.title,
        description: ProductCreated.description,
        price: ProductCreated.price,
        thumbnail: ProductCreated.thumbnail,
        code: ProductCreated.code,
        stock: ProductCreated.stock,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Error en el servidor",
      payload: {},
    });
  }
});

productsApiRouter.put("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { title, description, price, thumbnail, code, stock } = req.body;
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !_id
    ) {
      console.log("Por favor completa todos los campos");
      return res.status(400).json({
        status: "error",
        msg: "Por favor completa todos los campos",
        payload: {},
      });
    }
    try {
      const productUpdated = await productService.update({
        _id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
      if (productUpdated.matchedCount > 0) {
        return res.status(201).json({
          status: "success",
          msg: "product uptaded",
          payload: `Has actualizado el producto con ID ${_id}`,
        });
      } else {
        return res.status(404).json({
          status: "error",
          msg: "product not found",
          payload: {},
        });
      }
    } catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "Error al actualizar el producto",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Error en el servidor",
      payload: {},
    });
  }
});

productsApiRouter.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const result = await productService.delete(_id);

    if (result?.deletedCount > 0) {
      return res.status(200).json({
        status: "success",
        msg: "Producto Eliminado",
        payload: `Has eliminado el producto con ID ${_id}`,
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "El producto no existe",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Error en el servidor",
      payload: {},
    });
  }
});
