const Profile = require("../models/Profile");
const FollowProfile = require("../models/FollowProfile");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// follow or unfollow a user
const followOrUnfollowAUser = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;
  const { username } = req.params;

  const myProfile = await Profile.findOne({ user });
  if (!myProfile) {
    throw new ErrorResponse(404, "profile not found");
  }

  const userProfile = await Profile.findOne({ username });
  if (!userProfile) {
    throw new ErrorResponse(404, "user profile not found");
  }

  if (myProfile._id.toString() === userProfile._id.toString()) {
    throw new ErrorResponse(400, "you can't following your self");
  }

  let followProfile = await FollowProfile.findOne({
    following: userProfile._id,
    follower: myProfile._id,
  });

  if (!followProfile) {
    followProfile = new FollowProfile({
      following: userProfile._id,
      follower: myProfile._id,
    });
    await followProfile.save();
  } else {
    await FollowProfile.deleteOne({ _id: followProfile._id });
  }

  res.status(200).json({
    success: true,
  });
});

module.exports = { followOrUnfollowAUser };
