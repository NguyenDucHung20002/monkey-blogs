const Profile = require("../models/Profile");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");
const { ErrorResponse } = require("../response/ErrorResponse");

// login
const loginSuccess = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;

  const myProfile = await Profile.findOne({ user }).select(
    "-_id avatar fullname"
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

module.exports = { loginSuccess };
