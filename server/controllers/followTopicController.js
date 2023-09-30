const Topic = require("../models/Topic");
const Profile = require("../models/Profile");
const FollowTopic = require("../models/FollowTopic");
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

  let followTopic = await FollowTopic.findOne({
    follower: profile._id,
    topic: topic._id,
  });
  console.log(followTopic);
  if (!followTopic) {
    followTopic = new FollowTopic({
      follower: profile._id,
      topic: topic._id,
    });
    await followTopic.save();
  } else {
    await FollowTopic.deleteOne({ _id: followTopic._id });
  }

  res.status(200).json({
    success: true,
  });
});
module.exports = { followOrUnfollowATopic };
