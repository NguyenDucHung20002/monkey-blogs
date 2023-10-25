const Role = require("../models/Role");
const Token = require("../models/Token");
const addUrlToImg = require("../utils/addUrlToImg");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== login ==================== //

const login = asyncMiddleware(async (req, res, next) => {
  const { fullname, avatar, username, role } = req.me;

  const selectedRole = await Role.findById(role).lean().select("slug");
  if (!selectedRole) throw new ErrorResponse(404, "Role not found");

  addUrlToImg(avatar);

  const profile = { avatar, fullname, username, role: selectedRole.slug };

  res.status(200).json({ success: true, data: profile });
});

// ==================== Logout ==================== //

const logout = asyncMiddleware(async (req, res, next) => {
  const { me } = req;

  await Token.findOneAndDelete({ userId: me._id });

  res.status(200).json({ success: true });
});

module.exports = { login, logout };
