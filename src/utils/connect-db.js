import { connect } from "mongoose";

export async function connectMongo() {
  try {
    await connect("");
    console.log("Conectado a la base de datos");
  } catch (e) {
    console.log(e);
    throw "Falló la conexion";
  }
}
