import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import mongoose from "./config/database.js";
import MongoStore from "connect-mongo";
import handleErrors from "./middleware/errors/index.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { __dirname } from "./utils.js";
import socketController from "./controllers/socketControllers.js";
import { Server } from "socket.io";
import path from "path";
import dotenv from "dotenv";
import { addLogger } from "./logger/logger.js";
import flash from "connect-flash";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { roleOwnerCheck, roleCheck, eq } from "./views/helper.js";
import setupRoutes from "./routers/routes.js";


dotenv.config();
console.log("Entrega Final");
const app = express();
const PORT = process.env.PORT;

const httpServer = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion API",
      description: "documentación de api Productos y Cart de la Ticketera",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJsdoc(swaggerOptions);
const socketServer = new Server(httpServer);

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      roleOwnerCheck,
      roleCheck,
      eq,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "src/views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        process.env.TEST_ENV === "true"
          ? process.env.TEST_MONGO_URL
          : process.env.MONGO_URL,
      ttl: 14 * 24 * 60 * 60, // le damos un tiempo de vida a la session de 14 días
    }),
    cookie: {
      maxAge: 1000 * 60 * 60, // se permite la session por 1 hora
      httpOnly: true,
    },
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger);
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use(express.static(__dirname + "/public"));

//Llamamos a las rutas
setupRoutes(app)


app.use(handleErrors);
socketServer.on("connection", socketController);
