const Role = require("../models/Role");
const Token = require("../models/Token");
const addUrlToImg = require("../utils/addUrlToImg");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== login ==================== //

const login = asyncMiddleware(async (req, res, next) => {
  const { fullname, avatar, username, role } = req.me;

  addUrlToImg(avatar);

  const profile = { avatar, fullname, username, role: role.slug };

  res.status(200).json({ success: true, data: profile });
});

// ==================== Logout ==================== //

const logout = asyncMiddleware(async (req, res, next) => {
  const { me, token } = req;

  await Token.findOneAndDelete({ userId: me._id, token });

  res.status(200).json({ success: true });
});

module.exports = { login, logout };
