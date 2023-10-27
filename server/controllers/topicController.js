const Like = require("../models/Like");
const Topic = require("../models/Topic");
const toSlug = require("../utils/toSlug");
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== create topic ==================== //

const createTopic = asyncMiddleware(async (req, res, next) => {
  const { name } = req.body;

  const slug = toSlug(name);

  const existingTopic = await Topic.exists().or([{ name }, { slug }]);

  if (existingTopic) throw new ErrorResponse(409, "Topic already exists");

  const topic = new Topic({ name, slug });

  await topic.save();

  res.status(201).json({ success: true });
});

// ==================== update topic ==================== //

const updateTopic = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const { name } = req.body;

  const existingTopic = await Topic.exists({ slug });
  if (!existingTopic) throw new ErrorResponse(404, "Topic not found");

  const updatedSlug = toSlug(name);

  const NewName = await Topic.exists().or([{ name }, { slug: updatedSlug }]);

  if (NewName && NewName._id.toString() !== existingTopic._id.toString()) {
    throw new ErrorResponse(409, "Topic name already exist");
  }

  await Topic.findOneAndUpdate(
    { slug },
    { name, slug: updatedSlug },
    { new: true }
  );

  res.status(200).json({ success: true });
});

// ==================== delete topic ==================== //

const deleteTopic = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const deletedTopic = await Topic.findOneAndDelete({ slug });
  if (!deletedTopic) throw new ErrorResponse(404, "Topic not found");

  await FollowTopic.deleteMany({ slug });

  await Article.updateMany(
    { topics: deletedTopic._id },
    { $pull: { topics: deletedTopic._id } }
  );

  res.status(200).json({ success: true });
});

// ==================== get a topic ==================== //

const getATopic = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const { me } = req;

  const topic = await Topic.findOne({ slug }).lean();
  if (!topic) throw new ErrorResponse(404, "Topic not found");

  const result = { ...topic };

  if (me) {
    result.isFollowed = !!(await FollowTopic.exists({
      follower: me._id,
      topic: topic._id,
    }));
  }

  res.status(200).json({ success: true, data: result });
});

// ==================== count topic articles ==================== //

const countTopicArticles = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const topic = await Topic.findOne({ slug }).lean();
  if (!topic) throw new ErrorResponse(404, "Topic not found");

  const count = await Article.count({ topics: topic._id });

  res.status(200).json({ success: true, data: count });
});

// ==================== count topic followers ==================== //

const countTopicFollowers = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const topic = await Topic.findOne({ slug }).lean();
  if (!topic) throw new ErrorResponse(404, "Topic not found");

  const count = await FollowTopic.count({ topic: topic._id });

  res.status(200).json({ success: true, data: count });
});

// ==================== get topic articles ==================== //

const getTopicArticles = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { slug } = req.params;
  const { skip, limit = 15 } = req.query;

  const topic = await Topic.exists({ slug });
  if (!topic) throw new ErrorResponse(404, "Topic not found");

  const query = { topics: topic._id };
  if (skip) query._id = { $lt: skip };

  const articles = await Article.find(query)
    .lean()
    .limit(limit)
    .select("-content -topics -status")
    .populate({ path: "author", select: "avatar fullname username" })
    .sort({ createdAt: -1 });

  const result = await Promise.all(
    articles.map(async (val) => {
      val.author.avatar = addUrlToImg(val.author.avatar);
      val.img = addUrlToImg(val.img);
      const likeCount = await Like.count({ article: val._id });
      const commentCount = await Comment.count({ article: val._id });
      return me
        ? {
            ...val,
            likeCount,
            commentCount,
            isLiked: !!(await Like.exists({
              user: me._id,
              article: val._id,
            })),
          }
        : { ...val, likeCount, commentCount };
    })
  );

  const skipID = articles.length > 0 ? articles[articles.length - 1]._id : null;

  res.status(200).json({ success: true, data: result, skipID });
});

// ==================== get all topics ==================== //

const getAllTopics = asyncMiddleware(async (req, res, next) => {
  const { search, limit = 15, skip } = req.query;

  const query = {};

  if (skip) query._id = { $gt: skip };

  if (search) query.name = { $regex: search, $options: "i" };

  const topics = await Topic.find(query)
    .lean()
    .limit(limit)
    .select("name slug")
    .sort({ _id: 1 });

  const skipID = topics.length > 0 ? topics[topics.length - 1]._id : null;

  res.status(200).json({ success: true, data: topics, skipID });
});

// ==================== get random topics suggestions ==================== //

const getRandomTopics = asyncMiddleware(async (req, res, next) => {
  const { me } = req;

  const myFollowingTopics = await FollowTopic.find({ follower: me._id })
    .lean()
    .distinct("topic");

  const topics = await Topic.aggregate()
    .match({ _id: { $nin: myFollowingTopics } })
    .sample(8);

  res.status(200).json({ success: true, data: topics });
});

module.exports = {
  createTopic,
  updateTopic,
  deleteTopic,
  getATopic,
  countTopicArticles,
  countTopicFollowers,
  getAllTopics,
  getTopicArticles,
  getRandomTopics,
};
