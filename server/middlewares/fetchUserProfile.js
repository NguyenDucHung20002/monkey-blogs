const Profile = require("../models/Profile");
const { ErrorResponse } = require("../response/ErrorResponse");

const fetchProfile = async (req, res, next) => {
  try {
    if (!req.params) {
      throw new ErrorResponse(400, "invalid request");
    }

    const username = req.params.username;

    const userProfile = await Profile.findOne({ username });
    if (!userProfile) {
      throw new ErrorResponse(404, "Profile not found");
    }

    req.userProfile = userProfile;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = fetchProfile;
