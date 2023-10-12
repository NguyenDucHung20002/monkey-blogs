const Token = require("../models/Token");
const addUrlToImg = require("../utils/addUrlToImg");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== login ==================== //

const login = asyncMiddleware(async (req, res, next) => {
  const { fullname, username, avatar } = req.myProfile;

  const profile = {
    fullname,
    username,
    avatar: addUrlToImg(avatar),
  };

  res.status(200).json({
    success: true,
    data: profile,
  });
});

// ==================== Logout ==================== //

const logout = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;

  await Token.findOneAndDelete({ userId: user });

  res.status(200).json({
    success: true,
  });
});

module.exports = { login, logout };
