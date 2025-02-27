import dotenv from "dotenv";
import dbConnect from "./src/config/db.js";
import express from "express";
import Routes from "./src/Routes/Routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectRedis } from "./src/config/redisConnection.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(cookieParser());

dbConnect();
connectRedis();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello Jaimin");
});

app.use("/uploads", express.static("uploads"));
app.use("/api", Routes);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
