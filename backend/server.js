import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import couponRoute from "./routes/couponRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import analyticsRoute from "./routes/analyticsRoute.js";
import { connectDB } from "./lib/db.js";

import cookieParser from "cookie-parser";
// const ObjectId = require("mongodb").ObjectId;

import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors());
app.use(cors(corsOptions));
app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/analytics", analyticsRoute);

app.listen(5000, () => {
  console.log(`server is runing on port ${PORT}`);
  connectDB();
});
