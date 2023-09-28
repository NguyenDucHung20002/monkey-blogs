const { asyncMiddleware } = require("../middlewares/asyncMiddleware");
const { ErrorResponse } = require("../response/ErrorResponse");
const Profile = require("../models/Profile");
const FollowerShip = require("../models/FollowerShip");

// get my profile
const getAProfile = asyncMiddleware(async (req, res, next) => {
  const { username } = req.params;

  const profile = await Profile.findOne({ username });
  if (!profile) {
    throw new ErrorResponse(404, "profile not found");
  }

  const followerCount = await FollowerShip.countDocuments({
    following: profile._id,
  });

  const followingCount = await FollowerShip.countDocuments({
    follower: profile._id,
  });

  res.status(200).json({
    success: true,
    data: { profile, followerCount, followingCount },
  });
});

module.exports = { getAProfile };
