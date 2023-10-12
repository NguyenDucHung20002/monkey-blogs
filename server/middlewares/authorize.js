const User = require("../models/User");

exports.authorize = (requiredRole) => async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("role").populate({
      path: "role",
      select: "slug",
    });

    if (!user || !user.role || user.role.slug !== requiredRole) {
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
