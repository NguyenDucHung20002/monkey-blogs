const Topic = require("../models/Topic");
const toSlug = require("../utils/toSlug");
const Article = require("../models/Article");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== create topic ==================== //

const createTopic = asyncMiddleware(async (req, res, next) => {
  const { name } = req.body;

  const isExistedTopic = await Topic.findOne({ name });
  if (isExistedTopic) {
    throw new ErrorResponse(409, "topic already exists");
  }

  const slug = toSlug(name);

  const topic = new Topic({
    name,
    slug,
  });

  await topic.save();

  res.status(201).json({
    success: true,
  });
});

// ==================== update topic ==================== //

const updateTopic = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const { name } = req.body;

  let existingTopic = await Topic.findOne({ slug });
  if (!existingTopic) {
    throw new ErrorResponse(404, "topic not found");
  }

  const topicWithNewName = await Topic.findOne({ name });
  if (
    topicWithNewName &&
    topicWithNewName._id.toString() !== existingTopic._id.toString()
  ) {
    throw new ErrorResponse(404, "topic name already exist");
  }

  const updatedSlug = toSlug(name);

  await Topic.findOneAndUpdate(
    { slug },
    { name, slug: updatedSlug },
    { new: true }
  );

  res.status(200).json({
    success: true,
  });
});

// ==================== delete topic ==================== //

const deleteTopic = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const deletedTopic = await Topic.findOneAndDelete({ slug });

  await FollowTopic.deleteMany({ slug });

  await Article.updateMany(
    { topics: deletedTopic._id },
    { $pull: { topics: deletedTopic._id } }
  );

  res.status(200).json({
    success: true,
  });
});

// ==================== get a topic ==================== //

const getATopic = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const { myProfile } = req;

  const topic = await Topic.findOne({ slug }).select("-createdAt -updatedAt");
  if (!topic) {
    throw new ErrorResponse(404, "topic not found");
  }

  const followersCount = await FollowTopic.countDocuments({
    topic: topic._id,
  });

  const articlesCount = await Article.countDocuments({
    topics: topic._id,
  });

  let isFollowing = true;

  const checkExits = await FollowTopic.findOne({
    follower: myProfile ? myProfile._id : null,
    topic: topic._id,
  });
  if (!checkExits) {
    isFollowing = false;
  }

  res.status(200).json({
    success: true,
    data: { topic, followersCount, articlesCount, isFollowing },
  });
});

// ==================== get topics ==================== //

const getAllTopics = asyncMiddleware(async (req, res, next) => {
  const { search } = req.query;

  let topics;

  if (search) {
    const regex = new RegExp(search, "i");
    topics = await Topic.find({ slug: regex });
  } else {
    topics = await Topic.find();
  }

  res.status(200).json({
    success: true,
    data: topics,
  });
});

// ==================== get topic articles ==================== //

const getTopicArticles = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const topic = await Topic.findOne({ slug });
  if (!topic) {
    throw new ErrorResponse(404, "topic not found");
  }

  const articles = await Article.find({
    topics: topic._id,
  })
    .select("img title slug createdAt updatedAt")
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "avatar fullname username",
    });

  articles.forEach((article) => {
    if (article.author && article.author.avatar && article.img) {
      article.author.avatar = addUrlToImg(article.author.avatar);
      article.img = addUrlToImg(article.img);
    }
  });

  res.status(200).json({
    success: true,
    data: articles,
  });
});

// ==================== search topics ==================== //

const searchTopics = asyncMiddleware(async (req, res, next) => {
  const { search } = req.query;

  const regex = new RegExp(search, "i");

  let topics = [];

  if (search) {
    topics = await Topic.find({ name: regex });
  }

  res.status(200).json({
    success: true,
    data: topics,
  });
});

module.exports = {
  createTopic,
  updateTopic,
  deleteTopic,
  getATopic,
  getAllTopics,
  getTopicArticles,
  searchTopics,
};
