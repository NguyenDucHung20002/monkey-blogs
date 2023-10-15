const FollowUser = require("../models/FollowUser");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== follow or unfollow a profile ==================== //

const followOrUnfollowAUser = asyncMiddleware(async (req, res, next) => {
  const myUserId = req.myProfile._id;
  const { userProfile } = req;

  if (myUserId.toString() === userProfile._id.toString()) {
    throw new ErrorResponse(400, ":)");
  }

  let followUser = await FollowUser.findOne({
    follower: myUserId,
    following: userProfile._id,
  }).lean();

  if (!followUser) {
    followUser = new FollowUser({
      follower: myUserId,
      following: userProfile._id,
    });
    await followUser.save();
  } else {
    await FollowUser.deleteOne({ _id: followUser._id });
  }

  res.status(200).json({
    success: true,
  });
});

module.exports = { followOrUnfollowAUser };
