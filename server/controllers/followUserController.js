const FollowUser = require("../models/FollowUser");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== follow or unfollow a user ==================== //

const followOrUnfollowUser = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;

  if (me && me._id.toString() === user._id.toString()) {
    throw new ErrorResponse(400, ":)");
  }

  const data = { follower: me._id, following: user._id };

  let followUser = await FollowUser.findOne(data).lean();

  if (!followUser) {
    followUser = new FollowUser(data);
    await followUser.save();
  } else {
    await FollowUser.deleteOne({ _id: followUser._id });
  }

  res.status(200).json({ success: true });
});

module.exports = { followOrUnfollowUser };
