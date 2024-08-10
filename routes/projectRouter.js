import express from "express";
import {
  addWidgetConfigurations,
  createProject,
  getProjectData,
  getProjects,
  getWidgetData,
} from "../controllers/projectController.js";
import { protect } from "../middlewares/userAuth.js";
import { ImageUpload } from "../middlewares/multer.js";


const projectRoute = express.Router();
projectRoute.post("/create", protect, createProject);
projectRoute.get("/allProjects", protect, getProjects);
projectRoute.get("/data/:id", protect, getProjectData);
projectRoute.post(
  "/addWidget",
  protect,
  ImageUpload.single("botIcon"),
  addWidgetConfigurations
);
projectRoute.get("/getWidget/:id", protect, getWidgetData);

export default projectRoute;
