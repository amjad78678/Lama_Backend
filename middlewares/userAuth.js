/* eslint-disable no-undef */
import { decode } from "jsonwebtoken";
import User from "../models/userModel.js";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../config/jwtToken.js";

const protect = async (req, res, next) => {
  let userToken = req.cookies.user_access_token;
  const { userId } = decode(userToken);
  const { decoded } = verifyAccessToken(userToken);

  console.log("userId", userId);
  const { refreshToken } = await User.findOne({ _id: userId });

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Not authorized, no refresh token" });
  }

  if (!decoded) {
    try {
      const newUserToken = await refreshAccessToken(refreshToken);
      res.cookie("user_access_token", newUserToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
      });
      userToken = newUserToken;
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ message: "Failed to refresh access token" });
    }
  }

  try {
    const { decoded } = verifyAccessToken(userToken);
    console.log("decoded", decoded);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    if (!refreshToken) throw new Error("No refresh token found");
    const { decoded } = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.userId);
    return newAccessToken;
  } catch (error) {
    console.log(error);
    throw new Error("Invalid refresh token");
  }
};

export { protect };
