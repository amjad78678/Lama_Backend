import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import router from "./routes/router";
import connectDb from "./config/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "./public")));
app.use(cookieParser());
app.use(morgan("tiny"));

const startServer = async () => {
  await connectDb();

  app.use("/api", router);
  app.listen(PORT, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();
