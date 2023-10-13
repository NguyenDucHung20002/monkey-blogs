const User = require("../models/User");
const addUrlToImg = require("../utils/addUrlToImg");

const fetchProfile = async (req, res, next) => {
  try {
    if (!req.params) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: Missing username parameter",
      });
    }

    const username = req.params.username;

    const userProfile = await User.findOne({ username }).select(
      "-email -loginType -role -status"
    );
    if (!userProfile) {
      return res.status(401).json({
        success: false,
        message: "Profile not found",
      });
    }

    userProfile.avatar = addUrlToImg(userProfile.avatar);

    req.userProfile = userProfile;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = fetchProfile;
