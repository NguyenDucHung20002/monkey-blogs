const Topic = require("../models/Topic");
const Profile = require("../models/Profile");
const FollowingTopic = require("../models/FollowingTopic");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// follow or unfollow a topic
const followOrUnfollowATopic = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;
  const { slug } = req.params;

  const profile = await Profile.findOne({ user });
  if (!Profile) {
    throw new ErrorResponse(404, "profile not found");
  }

  const topic = await Topic.findOne({ slug });
  if (!topic) {
    throw new ErrorResponse(404, "topic not found");
  }

  let followingTopic = await FollowingTopic.findOne({
    follower: profile._id,
    topic: topic._id,
  });
  console.log(followingTopic);
  if (!followingTopic) {
    followingTopic = new FollowingTopic({
      follower: profile._id,
      topic: topic._id,
    });
    await followingTopic.save();
  } else {
    await FollowingTopic.deleteOne({ _id: followingTopic._id });
  }

  res.status(200).json({
    success: true,
  });
});
module.exports = { followOrUnfollowATopic };
