import express from "express";
import {
  createProject,
  getProjectData,
  getProjects,
} from "../controllers/projectController.js";
import { protect } from "../middlewares/userAuth.js";
const projectRoute = express.Router();

projectRoute.post("/create", protect, createProject);
projectRoute.get("/allProjects", protect, getProjects);
projectRoute.get("/data/:id", protect, getProjectData);

export default projectRoute;
