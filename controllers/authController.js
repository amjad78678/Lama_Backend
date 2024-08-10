/* eslint-disable no-undef */
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/jwtToken.js";
import fs from "fs";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
      sameSite: "none",
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
const getUserData = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    console.log("userid", req.userId);
    console.log("iam user", user);
    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY,
      },
      region: process.env.BUCKET_REGION,
    });

    if (user) {
      if (user.image !== null) {
        const getObjectParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: user.image,
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        console.log("iam url", { ...user._doc, image: url });
        res
          .status(200)
          .json({ success: true, user: { ...user._doc, image: url } });
      } else {
        res.status(200).json({ success: true, user });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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
const editUserData = async (req, res) => {
  try {
    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY,
      },
      region: process.env.BUCKET_REGION,
    });

    const uploadFile = async (file) => {
      const fileStream = fs.createReadStream(file.path);
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: file.filename,
        Body: fileStream,
      };
      const result = await s3.send(new PutObjectCommand(uploadParams));
      fs.unlinkSync(file.path);
      return result;
    };

    if (req.file) {
      const result = await uploadFile(req.file);

      if (result) {
        await User.updateOne(
          { _id: req.userId },
          { $set: { ...req.body, image: req.file.filename } }
        );
      }
    } else {
      await User.updateOne(
        { projectId: req.body.projectId },
        { $set: req.body }
      );
    }

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { userLogin, userRegister, userLogout, getUserData, editUserData };
