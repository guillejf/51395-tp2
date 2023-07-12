import fs from "fs";
import { __dirname } from "../../config.js";
const cartPath = `${__dirname}\/data/carts.JSON`;
export default class CartsManager {
  constructor() {
    this.path = cartPath;
    this.products = [];
  }

  getCarts() {
    let data = fs.readFileSync(this.path, "UTF-8");
    return JSON.parse(data);
  }

  getCartsById(id) {
    let data = fs.readFileSync(this.path, "UTF-8");
    let dataParse = JSON.parse(data);
    let cartFound = dataParse.find((prod) => +prod.id === +id);
    if (cartFound) {
      return cartFound;
    } else {
      return console.log("Not Found");
    }
  }

  addCart() {
    const oldCart = this.getCarts();
    let idMax = 0;
    oldCart.forEach((prod) => {
      if (prod.id > idMax) {
        idMax = prod.id;
      }
    });
    idMax++;
    oldCart.push({ id: idMax, products: [] });
    let cartStrings = JSON.stringify(oldCart);
    fs.writeFileSync(this.path, cartStrings);
    return cartStrings;
  }

  saveCarts(data) {
    let cartStrings = JSON.stringify(data);
    fs.writeFileSync(this.path, cartStrings);
  }
}
