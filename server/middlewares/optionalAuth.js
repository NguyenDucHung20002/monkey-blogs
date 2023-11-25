const Token = require("../models/Token");

const optionalAuth = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;

    if (!headerToken || !headerToken.startsWith("Bearer ")) {
      req.token = null;
      return next();
    }

    const token = headerToken.split(" ")[1];
    if (!token) {
      req.token = null;
      return next();
    }

    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
      req.token = null;
      return next();
    }

    req.token = token;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = optionalAuth;
