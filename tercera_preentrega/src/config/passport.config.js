import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import * as UsersControllers from "../controllers/usersControllers.js";
import userModel from "../dao/models/users.model.js";
import { createHash } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  //Registro de Usuario
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: createHash(password),
        };
        try {
          const result = await UsersControllers.createUser(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al obtener el usuario" + error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UsersControllers.findUser(username, password);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  //Login con GitHub
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ githubId: profile._json.id });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              age: 35,
              email: profile._json.email,
              githubId: profile._json.id,
            };
            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};

export default initializePassport;
