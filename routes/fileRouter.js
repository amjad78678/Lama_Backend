import express from "express";
import { protect } from "../middlewares/userAuth.js";
import {
  createProjectFile,
  deleteFile,
  editFileData,
  getFileData,
  getProjectFilesData,
} from "../controllers/fileController.js";
const fileRoute = express.Router();
fileRoute.post("/create", protect, createProjectFile);
fileRoute.get("/get/:id", protect, getProjectFilesData);
fileRoute.get("/getFileData/:fileId", protect, getFileData);
fileRoute.put("/editFile", protect, editFileData);
fileRoute.patch("/delete", protect, deleteFile);

export default fileRoute;
