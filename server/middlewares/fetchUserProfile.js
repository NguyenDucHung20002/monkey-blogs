const Profile = require("../models/Profile");
const { ErrorResponse } = require("../response/ErrorResponse");

const fetchProfile = async (req, res, next) => {
  try {
    const username = req.params.username;

    const userProfile = await Profile.findOne({ username });
    if (!userProfile) {
      throw new ErrorResponse(404, "Profile not found");
    }

    console.log(userProfile._id);

    req.userProfile = userProfile;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = fetchProfile;
