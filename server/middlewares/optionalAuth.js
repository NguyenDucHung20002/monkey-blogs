const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const Token = require("../models/Token");

const optionalAuth = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;

    if (!headerToken || !headerToken.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = headerToken.split(" ")[1];
    if (!token) {
      req.user = null;
      return next();
    }

    const user = jwt.verify(token, env.SECRET_KEY);
    const tokenDoc = await Token.findOne({ userId: user.id, token });
    if (!tokenDoc) {
      req.user = null;
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = optionalAuth;
