const Profile = require("../models/Profile");
const { ErrorResponse } = require("../response/ErrorResponse");

const fetchProfile = async (req, res, next) => {
  try {
    let user = req.user && req.user.id;
    let username = req.params.username;

    if (!user && !username) {
      throw new ErrorResponse(400, "Invalid request");
    }

    let profile, myProfile, userProfile;

    if (user) {
      profile = await Profile.findOne({ user });
    } else if (username) {
      profile = await Profile.findOne({ username });
    }

    if (!profile) {
      throw new ErrorResponse(404, "Profile not found");
    }

    req.profile = profile;

    if (user && username) {
      myProfile = profile;

      userProfile = await Profile.findOne({ username });
      if (!userProfile) {
        throw new ErrorResponse(404, "User profile not found");
      }

      req.myProfile = myProfile;
      req.userProfile = userProfile;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = fetchProfile;
