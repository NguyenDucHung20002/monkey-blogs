import env from "../config/env.js";
import RefreshToken from "../models/mongodb/RefreshToken.js";
import jwt from "jsonwebtoken";

const generateRefreshToken = async (payload) => {
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE_TIME,
  });

  const { exp, iat } = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

  await RefreshToken.create({
    userId: payload.id,
    token: refreshToken,
    exp,
    iat,
  });

  return refreshToken;
};

export default generateRefreshToken;
