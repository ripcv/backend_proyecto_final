//Vistas
import viewsRouter from "./views.js";
import ViewProductRouter from "./views/product.js";
import ViewCartRouter from "./views/cart.js";
import ViewchatRouter from "./views/chat.js";
import ViewUserRouter from "./views/user.js"

//Apis
import sessionsRouter from "./api/sessions.js";
import ApiProductRouter from "./api/product.js";
import ApiUserRouter from "./api/users.js";
import ApiCartRouter from "./api/cart.js";

//Varios
import mockingRouter from "./mocks.router.js";
import loggerRouter from "./loggerTest.router.js";

const setupRoutes = (app) => {
//Api Routers
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", ApiUserRouter);
app.use("/api/products", ApiProductRouter);
app.use("/api/carts", ApiCartRouter);
//View Routers
app.use("/products", ViewProductRouter);
app.use("/carts", ViewCartRouter);
app.use("/", viewsRouter);
app.use("/chat", ViewchatRouter);
app.use("/users",ViewUserRouter)

//Varios
app.use("/mockingproducts", mockingRouter);
app.use("/loggerview", loggerRouter);
}

export default setupRoutes