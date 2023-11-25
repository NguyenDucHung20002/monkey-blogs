const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { env } = require("../config/env");

const fetchMe = async (req, res, next) => {
  try {
    if (!req.token) {
      return next();
    }

    const token = req.token;

    const { id: user } = jwt.verify(token, env.SECRET_KEY);

    const me = await User.findById(user)
      .lean()
      .populate({ path: "role", select: "slug" });
    if (!me) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (me.status === "banned") {
      return res.status(403).json({
        success: false,
        message: "You are banned",
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
