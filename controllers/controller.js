import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/jwtToken.js";
import Project from "../models/projectModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    console.log("iam user", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    console.log("iam accessToken", accessToken);
    res.cookie("user_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ success: true, user: { email } });
  } catch (error) {
    console.log(error.message);
  }
};

const userRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    const userData = await newUser.save();

    if (userData) {
      res
        .status(201)
        .json({ success: true, message: "User created successfully" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const userLogout = async (req, res) => {
  try {
    console.log("iam in userLogout");

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.refreshToken = null;
    await user.save();

    res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const createProject = async (req, res) => {
  try {
    const { projectName } = req.body;

    const newProject = new Project({
      projectName,
      userId: req.userId,
    });
    const projectData = await newProject.save();
    if (projectData) {
      res.status(200).json({ success: true, message: "Project created" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getProjects = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('iam userId in projects', userId)
    const projects = await Project.find({ userId: userId });
    console.log('iam projects', projects)
    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { userLogin, userRegister, userLogout, createProject, getProjects };
