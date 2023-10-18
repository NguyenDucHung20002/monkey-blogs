const User = require("../models/User");
const addUrlToImg = require("../utils/addUrlToImg");

const fetchUser = async (req, res, next) => {
  try {
    if (!req.params) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: Missing username parameter",
      });
    }

    const username = req.params.username;

    const user = await User.findOne({ username })
      .lean()
      .select("-email -loginType -role -status");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Profile not found",
      });
    }

    user.avatar = addUrlToImg(user.avatar);

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = fetchUser;
