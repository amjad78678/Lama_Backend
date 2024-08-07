import express from "express";
import {
 
} from "../controllers/projectController.js";
import { protect } from "../middlewares/userAuth.js";
import { createProjectFile } from "../controllers/fileController.js";
const fileRoute = express.Router();

fileRoute.post("/create", protect, createProjectFile);

export default fileRoute;
