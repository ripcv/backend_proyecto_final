import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI =
  process.env.TEST_ENV === "true" ? process.env.TEST_MONGO_URL : process.env.MONGO_URL;
mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  let msg
  if(process.env.TEST_ENV==='true'){
    msg = "Base de pruebas"
  }else{
    msg = "Base de produccion"
  }
  
  console.log(`Connected to MongoDB - ${msg}`);
});

export default db;
