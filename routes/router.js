import express from "express";
import {

  userLogin,
  userLogout,
  userRegister,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);


export default router;
