const FollowUser = require("../models/FollowUser");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== follow or unfollow a profile ==================== //

const followOrUnfollowAUser = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;

  if (me && me._id.toString() === user._id.toString()) {
    throw new ErrorResponse(400, ":)");
  }

  let followUser = await FollowUser.findOne({
    follower: me._id,
    following: user._id,
  }).lean();

  if (!followUser) {
    followUser = new FollowUser({
      follower: me._id,
      following: user._id,
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
