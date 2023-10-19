const Like = require("../models/Like");
const Topic = require("../models/Topic");
const toSlug = require("../utils/toSlug");
const Comment = require("../models/Comment");
const Article = require("../models/Article");
const FollowUser = require("../models/FollowUser");
const addUrlToImg = require("../utils/addUrlToImg");
const { removeFile } = require("../utils/removeFile");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== create article ==================== //

const createAnArticle = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { title, preview, content, topics } = req.body;

  const filename = req.file?.filename;
  if (!filename) {
    throw new ErrorResponse(422, "article image is required");
  }

  const slug = toSlug(title) + "-" + Date.now();

  const article = new Article({
    author: me._id,
    title,
    preview,
    slug,
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
  const { me } = req;
  const { slug } = req.params;
  const { title, preview, content, topics } = req.body;

  const filename = req.file?.filename;

  const oldArticle = await Article.findOne({ slug })
    .lean()
    .select("_id slug img");
  if (!oldArticle) {
    throw new ErrorResponse(404, "article not found");
  }

  let updatedSlug;

  if (title) {
    updatedSlug = toSlug(title) + "-" + Date.now();
  } else {
    updatedSlug = oldArticle.slug;
  }

  await Article.findOneAndUpdate(
    { author: me._id, slug },
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
  const { me } = req;
  const { slug } = req.params;

  const article = await Article.findOneAndDelete({
    author: me._id,
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
  const { me } = req;
  const { slug } = req.params;

  const article = await Article.findOne({ slug, status: "approved" })
    .lean()
    .select("-status")
    .populate({ path: "author", select: "avatar fullname username" })
    .populate({ path: "topics", select: "name slug" });

  if (!article) {
    throw new ErrorResponse(404, "article not found");
  }

  article.img = addUrlToImg(article.img);

  article.author.avatar = addUrlToImg(article.author.avatar);

  const commentCount = await Comment.countDocuments({ article: article._id });

  const likes = await Like.find({ article: article._id })
    .lean()
    .distinct("user");

  const result = { article, likeCount: likes.length, commentCount };

  if (me) {
    result.isMyArticle = me._id.toString() === article.author._id.toString();
    if (!result.isMyArticle) {
      result.authorFollowing = !!(await FollowUser.exists({
        follower: me._id,
        following: article.author._id,
      }));
    }

    result.isLiked = likes.includes(me._id);
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

// ==================== get all articles when login ==================== //

const getAllArticles = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { tag, feed } = req.query;

  const findQuery = { status: "approved" };

  if (tag) {
    const topic = await Topic.exists({ slug: tag });
    if (!topic) {
      throw new ErrorResponse(404, "topic tag not found");
    }
    findQuery.topics = topic._id;
  }

  if (feed) {
    const myFollowing = await FollowUser.find({
      follower: me._id,
    })
      .lean()
      .distinct("following");
    findQuery.author = { $in: myFollowing };
  }

  const articles = await Article.find(findQuery)
    .lean()
    .select("-status -content")
    .populate({ path: "topics", options: { limit: 1 }, select: "name slug" })
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "avatar fullname username" });

  articles.forEach((article) => {
    article.author.avatar = addUrlToImg(article.author.avatar);
    article.img = addUrlToImg(article.img);
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
    topics = await Topic.find({ name: new RegExp(search, "i") }).lean();
  }

  res.status(200).json({
    success: true,
    data: topics,
  });
});

// ==================== search articles ==================== //

const searchArticles = asyncMiddleware(async (req, res, next) => {
  const { search } = req.body;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  let articles = [];

  if (search) {
    articles = await Article.find({
      title: new RegExp(search, "i"),
      status: "approved",
    })
      .lean()
      .skip(skip)
      .limit(limit)
      .select("-status -content")
      .populate({ path: "topics", options: { limit: 1 }, select: "name slug" })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "avatar fullname username" });

    articles.forEach((article) => {
      article.author.avatar = addUrlToImg(article.author.avatar);
      article.img = addUrlToImg(article.img);
    });
  }

  res.status(200).json({
    success: true,
    data: articles,
  });
});

module.exports = {
  createAnArticle,
  updateMyArticle,
  getAnArticle,
  deleteMyArticle,
  getAllArticles,
  searchTopics,
  searchArticles,
};
