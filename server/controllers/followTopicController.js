const Topic = require("../models/Topic");
const FollowTopic = require("../models/FollowTopic");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== follow or unfollow a topic ==================== //

const followOrUnfollowATopic = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { slug } = req.params;

  const topic = await Topic.findOne({ slug });
  if (!topic) throw new ErrorResponse(404, "topic not found");

  const data = { follower: me._id, topic: topic._id };

  let followTopic = await FollowTopic.findOne(data).lean();

  if (!followTopic) {
    followTopic = new FollowTopic(data);
    await followTopic.save();
  } else {
    await FollowTopic.deleteOne({ _id: followTopic._id });
  }

  res.status(200).json({ success: true });
});

module.exports = { followOrUnfollowATopic };
