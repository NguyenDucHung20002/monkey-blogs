const Token = require("../models/Token");
const addUrlToImg = require("../utils/addUrlToImg");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// Login
const login = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;

  const profile = {
    fullname: myProfile.fullname,
    username: myProfile.username,
    avatar: addUrlToImg(myProfile.avatar),
  };

  res.status(200).json({
    success: true,
    data: profile,
  });
});

// Logout
const logout = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;

  await Token.findOneAndDelete({ userId: user });

  res.status(200).json({
    success: true,
  });
});

module.exports = { login, logout };
