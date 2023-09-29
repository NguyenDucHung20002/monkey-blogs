const Profile = require("../models/Profile");
const FollowerShip = require("../models/FollowerShip");
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

  let followerShip = await FollowerShip.findOne({
    following: userProfile._id,
    follower: myProfile._id,
  });

  if (!followerShip) {
    followerShip = new FollowerShip({
      following: userProfile._id,
      follower: myProfile._id,
    });
    await followerShip.save();
  } else {
    await FollowerShip.deleteOne({ _id: followerShip._id });
  }

  res.status(200).json({
    success: true,
  });
});

module.exports = { followOrUnfollowAUser };
