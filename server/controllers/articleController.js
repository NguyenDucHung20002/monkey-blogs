const User = require("../models/User");
const Topic = require("../models/Topic");
const toSlug = require("../utils/toSlug");
const Article = require("../models/Article");
const FollowUser = require("../models/FollowUser");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { removeFile } = require("../utils/removeFile");
const FollowProfile = require("../models/FollowProfile");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");
const Like = require("../models/Like");

// ==================== create article ==================== //

// create an article
const createAnArticle = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;
  const { title, preview, content, topics } = req.body;

  const filename = req.file?.filename;
  if (!filename) {
    throw new ErrorResponse(422, "article image is required");
  }

  const slug = toSlug(title) + "-" + Date.now();

  const article = new Article({
    author: myProfile._id,
    title,
    preview,
    slug,
    preview,
    img: filename,
    content,
    topics,
  });

  await article.save();

  res.status(201).json({
    success: true,
  });
});

// ==================== update article ==================== //

const updateMyArticle = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;
  const { slug } = req.params;
  const { title, preview, content, topics } = req.body;

  const filename = req.file?.filename;

  const oldArticle = await Article.findOne({ author: myProfile._id, slug });
  if (!oldArticle) {
    throw new ErrorResponse(404, "article not found");
  }

  let updatedSlug;

  if (title) {
    updatedSlug = toSlug(title) + "-" + Date.now();
  } else {
    updatedSlug = toSlug(oldArticle.title) + "-" + Date.now();
  }

  await Article.findOneAndUpdate(
    { author: myProfile._id, slug },
    { title, preview, slug: updatedSlug, img: filename, content, topics },
    { new: true }
  );

  if (filename) {
    removeFile(oldArticle.img);
  }

  res.status(200).json({
    success: true,
  });
});

// ==================== delete article ==================== //

const deleteMyArticle = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;
  const { slug } = req.params;

  const article = await Article.findOneAndDelete({
    author: myProfile._id,
    slug,
  });
  if (article) {
    removeFile(article.img);
  }

  res.status(200).json({
    success: true,
  });
});

// ==================== get an article ==================== //

const getAnArticle = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const { myProfile } = req;

  const article = await Article.findOne({ slug, status: "approved" })
    .populate({
      path: "author",
      select: "avatar fullname username",
    })
    .populate({
      path: "topics",
      select: "name slug",
    });

  if (!article) {
    throw new ErrorResponse(404, "article not found");
  }

  const likeCount = await Like.countDocuments({ article: article._id });

  res.status(200).json({
    success: true,
    data: { article, likeCount },
  });
});

// get article likes
const getArticleLikes = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const article = await Article.findOne({ slug, status: "approved" });
  if (!article) {
    throw new ErrorResponse(404, "article not found");
  }

  const likes = await Like.find({ article: article._id })
    .select("profile")
    .populate({
      path: "profile",
      select: "avatar fullname username",
    })
    .sort({ createdAt: -1 });

  likes.forEach((user) => {
    if (user.profile && user.profile.avatar) {
      user.profile.avatar = addUrlToImg(user.profile.avatar);
    }
  });

  res.status(200).json({
    success: true,
    data: likes,
  });
});

// get all articles
const getAllArticles = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;
  const { tag, feed } = req.query;

  const findQuery = {
    status: "approved",
  };

  const topic = await Topic.findOne({ slug: tag });
  if (!topic) {
    throw new ErrorResponse(404, "topic tag not found");
  }

  if (!tag) {
    articles = Article.find({ status: "approved" });
  } else {
    articles = Article.find({
      topics: topic._id,
      status: "approved",
    });
  }

  articles = await articles
    .select("title slug createdAt updatedAt")
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

// ==================== search topics for create article ==================== //

const searchTopics = asyncMiddleware(async (req, res, next) => {
  const { search } = req.body;

  let topics = [];

  if (search) {
    const regex = new RegExp(search, "i");
    topics = await Topic.find({ name: regex });
  }

  const topicsWithCounts = await Promise.all(
    topics.map(async (topic) => {
      const followersCount = await FollowTopic.countDocuments({
        topic: topic._id,
      });
      return {
        _id: topic._id,
        name: topic.name,
        slug: topic.slug,
        followersCount,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: topicsWithCounts,
  });
});

module.exports = {
  createAnArticle,
  updateMyArticle,
  getAnArticle,
  deleteMyArticle,
  getAllArticles,
  searchTopics,
};
