const Topic = require("../models/Topic");
const FollowTopic = require("../models/FollowTopic");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== follow or unfollow a topic ==================== //

const followOrUnfollowATopic = asyncMiddleware(async (req, res, next) => {
  const myUserId = req.myProfile._id;
  const { slug } = req.params;

  const topic = await Topic.findOne({ slug });
  if (!topic) {
    throw new ErrorResponse(404, "topic not found");
  }

  let followTopic = await FollowTopic.findOne({
    follower: myUserId,
    topic: topic._id,
  }).lean();

  if (!followTopic) {
    followTopic = new FollowTopic({
      follower: myUserId,
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
