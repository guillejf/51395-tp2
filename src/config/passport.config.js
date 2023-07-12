import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { UserModel } from "../DAO/models/users.model.js";
import { userService } from "../services/users.service.js";
const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          if (!user) {
            console.log("User Not Found with username (email) " + username);
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            console.log("Invalid Password");
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { firstName, lastName, age } = req.body;

          const userExist = await userService.findUserByEmail(username);

          if (userExist) {
            console.log("User already exists");
            return done(null, false);
          }

          const userCreated = await userService.create({
            firstName,
            lastName,
            email: username,
            age,
            password,
          });
          console.log("User Registration succesful");
          return done(null, {
            _id: userCreated._id.toString(),
            firstName: userCreated.firstName,
            email: userCreated.email,
            rol: userCreated.rol,
          });
        } catch (e) {
          console.log("Error in register");
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
}
