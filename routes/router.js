import express from "express";
import {
  editUserData,
  getUserData,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/authController.js";
import { protect } from "../middlewares/userAuth.js";
import { ImageUpload } from "../middlewares/multer.js";
const router = express.Router();

router.post("/signup", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);
router.get("/getUserData", protect, getUserData);
router.put("/editUser", protect, ImageUpload.single("image"), editUserData);

export default router;
