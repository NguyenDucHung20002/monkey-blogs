const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const Token = require("../models/Token");

const jwtAuth = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;

    if (!headerToken || !headerToken.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = headerToken.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = jwt.verify(token, env.SECRET_KEY);
    const tokenDB = await Token.findOne({ userId: user.id, token });
    if (!tokenDB) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = jwtAuth;
