const User = require("../models/User");

const fetchMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const { id: user } = req.user;

    const me = await User.findById(user).lean();
    if (!me) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.me = me;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = fetchMe;
