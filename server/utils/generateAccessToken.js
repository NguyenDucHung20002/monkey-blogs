import env from "../config/env.js";
import RefreshToken from "../models/mongodb/RefreshToken.js";
import jwt from "jsonwebtoken";

const generateAccessToken = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

    const user = await RefreshToken.findOne({
      userId: payload.id,
      token: refreshToken,
      exp: payload.exp,
      iat: payload.iat,
    });

    if (!user) {
      return "";
    }

    const accessToken = jwt.sign({ id: user.userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRE_TIME,
    });

    return accessToken;
  } catch (error) {
    return "";
  }
};

export default generateAccessToken;
