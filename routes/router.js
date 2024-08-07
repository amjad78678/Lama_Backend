import express from "express";
import {
  createProject,
  getProjects,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/controller.js";
import { protect } from "../middlewares/userAuth.js";
const router = express.Router();

router.post("/signup", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);
router.post("/project/create", protect, createProject);
router.get('/projects',protect,getProjects)

export default router;
