const Token = require("../models/Token");

const requiredAuth = async (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken || !headerToken.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized1",
    });
  }

  const token = headerToken.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized2",
    });
  }

  try {
    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized3",
      });
    }

    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized4",
    });
  }
};

module.exports = requiredAuth;
