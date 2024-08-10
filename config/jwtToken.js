/* eslint-disable no-undef */
import jwt from "jsonwebtoken";


const refreshAccessToken = async (refreshToken) => {
  try {
    if (!refreshToken) throw new Error("No refresh token found");
    const { decoded } = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.userId);
    return newAccessToken;
  } catch (error) {
    console.error(error);
    throw new Error("Invalid refresh token");
  }
};



function generateAccessToken(userId) {
  const ACCESS_SECRETKEY = process.env.JWT_ACCESS_SECRET_KEY;

  if (!ACCESS_SECRETKEY) {
    throw new Error("JWT key is not defined!");
  }

  return jwt.sign({ userId }, ACCESS_SECRETKEY, { expiresIn: "15m" });
}

function generateRefreshToken(userId) {
  const REFRESH_SECRETKEY = process.env.JWT_REFRESH_SECRET_KEY;

  if (!REFRESH_SECRETKEY) {
    throw new Error("JWT key is not defined!");
  }

  return jwt.sign({ userId }, REFRESH_SECRETKEY, { expiresIn: "30d" });
}

function verifyAccessToken(token) {
  try {
    const secret = process.env.JWT_ACCESS_SECRET_KEY;
    if (!secret) throw new Error("JWT key is not defined!");
    const decoded = jwt.verify(token, secret);
    return { decoded };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Token Expired!");
    }
    throw new Error("Invalid token");
  }
}

function verifyRefreshToken(token) {
  try {
    const secret = process.env.JWT_REFRESH_SECRET_KEY;
    if (!secret) throw new Error("JWT key is not defined!");
    const decoded = jwt.verify(token, secret);
    return { decoded };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Refresh Token Expired!");
    }
    throw new Error("Invalid refresh token");
  }
}


export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken
};
