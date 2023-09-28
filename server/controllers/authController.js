const Profile = require("../models/Profile");
const Token = require("../models/Token");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");
const { ErrorResponse } = require("../response/ErrorResponse");

// Login
const login = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;

  const myProfile = await Profile.findOne({ user }).select(
    "-_id avatar fullname username"
  );
  if (!myProfile) {
    throw new ErrorResponse(404, "profile not found");
  }

  console.log(myProfile);

  res.status(200).json({
    success: true,
    data: myProfile,
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
