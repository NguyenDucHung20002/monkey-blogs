const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const Token = require("../models/Token");

const jwtAuth = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    const body = req.body;
    console.log("body:", body);
    console.log("headerToken:", headerToken);

    if (!headerToken || !headerToken.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = headerToken.split(" ")[1];
    console.log("token:", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = jwt.verify(token, env.SECRET_KEY);
    const tokenDoc = await Token.findOne({ userId: user.id, token });
    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = jwtAuth;
