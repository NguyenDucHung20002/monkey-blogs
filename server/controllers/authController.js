const Role = require("../models/Role");
const Token = require("../models/Token");
const addUrlToImg = require("../utils/addUrlToImg");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== login ==================== //

const login = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;

  const selectedRole = await Role.findById(myProfile.role)
    .lean()
    .select("slug");
  if (!selectedRole) {
    throw new ErrorResponse(404, "Role not found");
  }

  const profile = {
    avatar: addUrlToImg(myProfile.avatar),
    fullname: myProfile.fullname,
    username: myProfile.username,
    role: selectedRole.slug,
  };

  res.status(200).json({
    success: true,
    data: profile,
  });
});

// ==================== Logout ==================== //

const logout = asyncMiddleware(async (req, res, next) => {
  const userId = req.myProfile._id;

  await Token.findOneAndDelete({ userId });

  res.status(200).json({
    success: true,
  });
});

module.exports = { login, logout };
