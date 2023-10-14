const Like = require("../models/Like");
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

  const slug = toSlug(name);

  const isExistedTopic = await Topic.findOne().or([{ name }, { slug }]);

  if (isExistedTopic) {
    throw new ErrorResponse(409, "Topic already exists");
  }

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

  const existingTopic = await Topic.findOne({ slug });
  if (!existingTopic) {
    throw new ErrorResponse(404, "Topic not found");
  }

  const updatedSlug = toSlug(name);

  const topicWithNewName = await Topic.findOne().or([
    { name },
    { slug: updatedSlug },
  ]);

  if (
    topicWithNewName &&
    topicWithNewName._id.toString() !== existingTopic._id.toString()
  ) {
    throw new ErrorResponse(404, "Topic name already exist");
  }

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
  if (!deletedTopic) {
    throw new ErrorResponse(404, "Topic not found");
  }

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

  const response = {
    topic,
    followersCount,
    articlesCount,
  };

  if (myProfile) {
    response.isFollowing = (await FollowTopic.findOne({
      follower: myProfile._id,
      topic: topic._id,
    }))
      ? true
      : false;
  }

  res.status(200).json({
    success: true,
    data: response,
  });
});

// ==================== get all topics ==================== //

const getAllTopics = asyncMiddleware(async (req, res, next) => {
  const { search } = req.query;

  let topics;

  if (search) {
    const regex = new RegExp(search, "i");
    topics = Topic.find({ slug: regex });
  } else {
    topics = Topic.find();
  }

  topics = await topics.select("name slug");

  res.status(200).json({
    success: true,
    data: topics,
  });
});

// ==================== get topic articles ==================== //

const getTopicArticles = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;
  const { slug } = req.params;

  const topic = await Topic.findOne({ slug });
  if (!topic) {
    throw new ErrorResponse(404, "topic not found");
  }

  const articles = await Article.find({
    topics: topic._id,
  })
    .select("author img title preview slug createdAt updatedAt")
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "avatar fullname username",
    });

  const result = await Promise.all(
    articles.map(async (article) => {
      const articleData = { ...article.toObject() };
      if (article.author && article.author.avatar && article.img) {
        article.author.avatar = addUrlToImg(article.author.avatar);
        article.img = addUrlToImg(article.img);
      }
      const likeCount = await Like.countDocuments({ article: article._id });
      return myProfile
        ? {
            ...articleData,
            likeCount,
            isLiked: (await Like.findOne({
              article: article._id,
              user: myProfile._id,
            }))
              ? true
              : false,
          }
        : { ...articleData, likeCount };
    })
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

// ==================== get random topics suggestions ==================== //

const getRandomTopics = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;

  const myFollowingTopics = await FollowTopic.find({ follower: myProfile._id });
  const topicIds = myFollowingTopics.map((topicId) => {
    return topicId.topic.toString();
  });

  let topics = await Topic.aggregate()
    .match({ _id: { $nin: topicIds } })
    .project("-createdAt -updatedAt")
    .sample(8);

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
  getRandomTopics,
};
