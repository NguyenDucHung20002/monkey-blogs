const Token = require("../models/Token");
const Profile = require("../models/Profile");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// Login
const login = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;

  const profile = await Profile.findOne({ user }).select(
    "-_id avatar fullname username"
  );
  if (!profile) {
    throw new ErrorResponse(404, "profile not found");
  }

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
