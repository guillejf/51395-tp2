import { Server } from "socket.io";
import { MsgModel } from "../DAO/models/msgs.model.js";
import { ProductsModel } from "../DAO/models/products.model.js";

export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", async (socket) => {
    console.log(`Nuevo usuario conectado a traves de ${socket.id}`);

    try {
      const allProducts = await ProductsModel.find({});
      socket.emit("products", allProducts);
    } catch (e) {
      console.log(e);
    }

    socket.on("new-product", async (newProd) => {
      try {
        await ProductsModel.create(newProd);
        const prods = await ProductsModel.find({});
        socketServer.emit("products", prods);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("productModified", async (id, newProd) => {
      try {
        console.log(id);
        console.log(newProd);
        await ProductsModel.findOneAndUpdate({ _id: id }, newProd);
        const prod = await ProductsModel.find({});
        socketServer.emit("products", prod);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("delete-product", async (idProd) => {
      try {
        await ProductsModel.deleteOne({ _id: idProd });
        const prods = await ProductsModel.find({});
        socketServer.emit("products", prods);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("msg_front_to_back", async (msg) => {
      try {
        await MsgModel.create(msg);
      } catch (e) {
        console.log(e);
      }
      try {
        const msgs = await MsgModel.find({});
        socketServer.emit("listado_de_msgs", msgs);
      } catch (e) {
        console.log(e);
      }
    });
  });
}
