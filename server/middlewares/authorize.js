const Role = require("../models/Role");
const User = require("../models/User");

exports.authorize = (requiredRole) => async (req, res, next) => {
  try {
    const { role } = req.me;

    if (role.slug !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: "No Permission",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
