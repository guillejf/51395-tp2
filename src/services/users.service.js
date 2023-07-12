import { UserModel } from "../DAO/models/users.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
class UserService {
  async findUserByEmailPassword(email, password) {
    const user = await UserModel.findOne(
      { email: email },
      {
        _id: true,
        email: true,
        firstName: true,
        password: true,
        rol: true,
      }
    );

    if (user && isValidPassword(password, user.password)) {
      return user;
    }

    return false;
  }
  // async findUser(email, password) {
  //   const user = await UserModel.findOne(
  //     { email: email, password: password },
  //     {
  //       _id: true,
  //       email: true,
  //       username: true,
  //       password: true,
  //       rol: true,
  //     }
  //   );
  //   return user || false;
  // }

  async findUserByEmail(email) {
    const user = await UserModel.findOne(
      { email: email },
      {
        _id: true,
        email: true,
        username: true,
        password: true,
        rol: true,
      }
    );
    return user || false;
  }

  async getAll() {
    const users = await UserModel.find(
      {},
      {
        _id: true,
        email: true,
        username: true,
        password: true,
        rol: true,
      }
    );
    return users;
  }
  async create({ firstName, lastName, email, age, password }) {
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      //return "El usuario ya se encuentra registrado";
      throw "User already exists";
    }

    //TODO: cuando se crea un usuario seria bueno ya crear un cart en la collection de carts y meter el id correcto aqui abajo.
    const userCreated = await UserModel.create({
      firstName,
      lastName,
      email,
      age,
      password: createHash(password),
      cart: "",
      rol: "user",
    });

    return userCreated;
  }
  async updateOne({ _id, email, username, password, rol }) {
    const userUptaded = await UserModel.updateOne(
      {
        _id: _id,
      },
      {
        email,
        username,
        password,
        rol,
      }
    );
    return userUptaded;
  }

  async deleteOne(_id) {
    const result = await UserModel.deleteOne({ _id: _id });
    return result;
  }
}
export const userService = new UserService();
