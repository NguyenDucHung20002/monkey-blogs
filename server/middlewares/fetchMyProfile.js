const Profile = require("../models/Profile");
const { ErrorResponse } = require("../response/ErrorResponse");

const fetchMyProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const user = req.user.id;

    const myProfile = await Profile.findOne({ user });
    if (!myProfile) {
      throw new ErrorResponse(404, "Profile not found");
    }

    req.myProfile = myProfile;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = fetchMyProfile;
