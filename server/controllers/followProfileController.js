const Profile = require("../models/Profile");
const FollowProfile = require("../models/FollowProfile");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// follow or unfollow a user
const followOrUnfollowAUser = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;

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
