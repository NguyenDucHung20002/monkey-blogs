const User = require("../models/User");
const addUrlToImg = require("../utils/addUrlToImg");

const fetchMyProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const { id: user } = req.user;

    const myProfile = await User.findById(user).lean();
    if (!myProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.myProfile = myProfile;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = fetchMyProfile;
