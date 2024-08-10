/* eslint-disable no-undef */
import { decode } from "jsonwebtoken";
import User from "../models/userModel.js";
import { refreshAccessToken, verifyAccessToken } from "../config/jwtToken.js";

const protect = async (req, res, next) => {
  let userToken = req.cookies.user_access_token;

  if (!userToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const { decoded } = verifyAccessToken(userToken);
    if (decoded) {
      req.userId = decoded.userId;
      return next();
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const user = await User.findOne({ _id: decode(userToken).userId });
    if (!user || !user.refreshToken) {
      return res
        .status(401)
        .json({ message: "Not authorized, no refresh token" });
    }

    const newUserToken = await refreshAccessToken(user.refreshToken);
    res.cookie("user_access_token", newUserToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV !== "development",
    });

    const { decoded } = verifyAccessToken(newUserToken);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export { protect };
