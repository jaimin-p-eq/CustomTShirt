import dotenv from "dotenv";
import dbConnect from "./db.js";
import express from "express";
import UserRoute from "./Routes/User.Routes.js";
import ProductRoute from "./Routes/Product.Routes.js";
import OrderRoute from "./Routes/Order.Routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import CustomizationOptionsRoute from "./Routes/CustomizationOptions.Route.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

dbConnect();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello Jaimin");
});

app.use("/api/user", UserRoute);
app.use("/api/product", ProductRoute);
app.use("/api/order", OrderRoute);
app.use("/api/customization-options", CustomizationOptionsRoute);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
