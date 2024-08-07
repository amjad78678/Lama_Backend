import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDb from "./config/db.js";
import router from "./routes/router.js";
import fileRoute from "./routes/fileRouter.js";
import projectRoute from "./routes/projectRouter.js";
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
app.use(cookieParser());
app.use(morgan("tiny"));

const startServer = async () => {
  await connectDb();

  app.use("/api", router);
  app.use("/api/project", projectRoute);
  app.use("/api/file",fileRoute);
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
};

startServer();
