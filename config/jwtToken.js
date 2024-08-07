import jwt from "jsonwebtoken";

function generateAccessToken(userId) {
  const ACCESS_SECRETKEY = process.env.JWT_ACCESS_SECRET_KEY;

  if (ACCESS_SECRETKEY) {
    const token = jwt.sign({ userId }, ACCESS_SECRETKEY, {
      expiresIn: "15m",
    });
    return token;
  }

  throw new Error("JWT key is not defined!");
}
function generateRefreshToken(userId) {
  const REFRESH_SECRETKEY = process.env.JWT_REFRESH_SECRET_KEY;

  if (REFRESH_SECRETKEY) {
    const token = jwt.sign({ userId }, REFRESH_SECRETKEY, {
      expiresIn: "30d",
    });
    return token;
  }

  throw new Error("JWT key is not defined!");
}

function verifyAccessToken(token) {
  try {
    let secret = process.env.JWT_ACCESS_SECRET_KEY;
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
    let secret = process.env.JWT_REFRESH_SECRET_KEY;
    if (secret) {
      const decoded = jwt.verify(token, secret);
      return { decoded };
    }
    throw new Error("JWT key is not defined!");
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      return { success: false, message: "Token Expired!" };
    } else {
      return { success: false, message: "Internal server error" };
    }
  }
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
