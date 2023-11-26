import Follow_Topic from "../models/mysql/Follow_Topic.js";
import Topic from "../models/mysql/Topic.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import { Op } from "sequelize";

// ==================== follow a topic ==================== //
const followATopic = asyncMiddleware(async (req, res, next) => {
  const myUser = req.user;
  const { id } = req.params;

  const topic = await Topic.findOne({
    where: { id, status: "approved" },
    attributes: ["id", "name"],
  });

  if (!topic) throw ErrorResponse(404, "Topic not found");

  if (!myUser.profileInfo) throw ErrorResponse(404, "Profile not found");

  const followTopic = await Follow_Topic.findOne({
    where: { topicId: topic.id, profileId: myUser.profileInfo.id },
    attributes: ["id"],
  });

  if (!followTopic) {
    await Promise.all([
      Follow_Topic.create({
        topicId: topic.id,
        profileId: myUser.profileInfo.id,
      }),
      topic.increment({ followersCount: 1 }),
    ]);
  }

  res.json({ success: true, message: `Successfully followed ${topic.name}` });
});

// ==================== unfollow a topic ==================== //
const unFollowATopic = asyncMiddleware(async (req, res, next) => {
  const myUser = req.user;
  const { id } = req.params;

  const topic = await Topic.findOne({
    where: { id, status: "approved" },
    attributes: ["id", "name"],
  });

  if (!topic) throw ErrorResponse(404, "Topic not found");

  if (!myUser.profileInfo) throw ErrorResponse(404, "Profile not found");

  const followTopic = await Follow_Topic.findOne({
    where: { topicId: topic.id, profileId: myUser.profileInfo.id },
    attributes: ["id"],
  });

  if (followTopic) {
    await Promise.all([
      followTopic.destroy(),
      topic.increment({ followersCount: -1 }),
    ]);
  }

  res.json({ success: true, message: `Successfully unfollowed ${topic.name}` });
});

// ==================== get my followed topics ==================== //
const getMyFollowingTopics = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const { skip = 0, limit = 15 } = req.query;

  const followedTopics = await Follow_Topic.findAll({
    where: { profileId: user.profileId.id, id: { [Op.gt]: skip } },
    include: {
      model: Topic,
      as: "topicFollower",
      attributes: ["id", "name", "slug"],
    },
  });

  const newSkip =
    followedTopics.length > 0
      ? followedTopics[followedTopics.length - 1].id
      : null;

  res.json({ success: true, data: followedTopics, newSkip });
});

export default { followATopic, unFollowATopic, getMyFollowingTopics };
