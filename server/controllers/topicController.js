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

  const isExistedTopic = await Topic.exists().or([{ name }, { slug }]);

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

  const existingTopic = await Topic.exists({ slug });
  if (!existingTopic) {
    throw new ErrorResponse(404, "Topic not found");
  }

  const updatedSlug = toSlug(name);

  const topicWithNewName = await Topic.exists().or([
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
  const { me } = req;

  const topic = await Topic.findOne({ slug }).lean();
  if (!topic) {
    throw new ErrorResponse(404, "topic not found");
  }

  const [followers, articlesCount] = await Promise.all([
    FollowTopic.find({ topic: topic._id }).lean().distinct("follower"),
    Article.countDocuments({ topics: topic._id }),
  ]);

  const result = {
    topic,
    followersCount: followers.length,
    articlesCount,
  };

  if (me) {
    result.isFollowing = followers.includes(me._id);
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

// ==================== get topic articles ==================== //

const getTopicArticles = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { slug } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const topic = await Topic.exists({ slug });
  if (!topic) {
    throw new ErrorResponse(404, "topic not found");
  }

  const articles = await Article.find({ topics: topic._id })
    .lean()
    .skip(skip)
    .limit(limit)
    .select("-content -topics -status")
    .populate({
      path: "author",
      select: "avatar fullname username",
    })
    .sort({ createdAt: -1 });

  const result = await Promise.all(
    articles.map(async (article) => {
      if (article && article.author && article.author.avatar && article.img) {
        article.author.avatar = addUrlToImg(article.author.avatar);
        article.img = addUrlToImg(article.img);
      }
      const like = await Like.find({ article: article._id })
        .lean()
        .distinct("user");
      const commentCount = await Comment.countDocuments({
        article: article._id,
      });
      const likeCount = like.length;
      return me
        ? {
            ...article,
            likeCount,
            commentCount,
            isLiked: like.includes(me._id),
          }
        : { ...article, likeCount, commentCount };
    })
  );

  res.status(200).json({
    success: true,
    data: result,
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

  topics = await topics.lean().select("name slug");

  res.status(200).json({
    success: true,
    data: topics,
  });
});

// ==================== get random topics suggestions ==================== //

const getRandomTopics = asyncMiddleware(async (req, res, next) => {
  const { me } = req;

  const myFollowingTopics = await FollowTopic.find({ follower: me._id })
    .lean()
    .distinct("topic");

  const topics = await Topic.aggregate()
    .match({ _id: { $nin: myFollowingTopics } })
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
