const Profile = require("../models/Profile");
const { ErrorResponse } = require("../response/ErrorResponse");

const fetchProfile = async (req, res, next) => {
  try {
    let user = req.user?.id;
    let username = req.params?.username;

    if (!user && !username) {
      throw new ErrorResponse(400, "Invalid request");
    }

    if (user && username) {
      const [myProfile, userProfile] = await Promise.all([
        await Profile.findOne({ user }),
        await Profile.findOne({ username }),
      ]);

      if (!user || !userProfile) {
        throw new ErrorResponse(404, "profile not found");
      }

      req.myProfile = myProfile;
      req.userProfile = userProfile;
    } else {
      const profile = user
        ? await Profile.findOne({ user })
        : await Profile.findOne({ username });

      if (!profile) {
        throw new ErrorResponse(404, "profile not found");
      }

      req.profile = profile;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = fetchProfile;
