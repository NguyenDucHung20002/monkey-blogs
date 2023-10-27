const mongoose = require("mongoose");
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
  if (!filename) throw new ErrorResponse(422, "article image is required");

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

  res.status(201).json({ success: true });
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
  if (!oldArticle) throw new ErrorResponse(404, "article not found");

  const updatedSlug = title
    ? toSlug(title) + "-" + Date.now()
    : oldArticle.slug;

  await Article.findOneAndUpdate(
    { author: me._id, slug },
    { title, preview, slug: updatedSlug, img: filename, content, topics },
    { new: true }
  );

  if (filename) removeFile(oldArticle.img);

  res.status(200).json({ success: true });
});

// ==================== delete article ==================== //

const deleteMyArticle = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { slug } = req.params;

  const article = await Article.findOneAndDelete({ author: me._id, slug });

  await Comment.deleteMany({ article: article._id });

  await Like.deleteMany({ article: article._id });

  if (article) removeFile(article.img);

  res.status(200).json({ success: true });
});

// ==================== get an article ==================== //

const getAnArticle = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { slug } = req.params;

  const article = await Article.findOne({ slug, status: "approved" })
    .lean()
    .select("-status")
    .populate({ path: "topics", select: "name slug" })
    .populate({ path: "author", select: "avatar fullname username" });

  if (!article) throw new ErrorResponse(404, "article not found");

  article.img = addUrlToImg(article.img);

  article.author.avatar = addUrlToImg(article.author.avatar);

  const result = { ...article };

  if (me) {
    result.isLiked = !!(await Like.exists({
      user: me._id,
      article: article._id,
    }));
    result.isMyArticle = me._id.toString() === article.author._id.toString();
    if (!result.isMyArticle) {
      result.authorFollowed = !!(await FollowUser.exists({
        follower: me._id,
        following: article.author._id,
      }));
    }
  }

  res.status(200).json({ success: true, data: result });
});

// ==================== count article likes ==================== //

const countArticleLikes = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const article = await Article.exists({ slug, status: "approved" });

  if (!article) throw new ErrorResponse(404, "article not found");

  const count = await Like.count({ article: article._id });

  res.status(200).json({ success: true, data: count });
});

// ==================== count article commets ==================== //

const countArticleComments = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const article = await Article.exists({ slug, status: "approved" });

  if (!article) throw new ErrorResponse(404, "article not found");

  const count = await Comment.count({ article: article._id });

  res.status(200).json({ success: true, data: count });
});

// ==================== get all articles ==================== //

const getAllArticles = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;

  const query = { status: "approved" };

  if (skip) query._id = { $lt: skip };

  const articles = await Article.find(query)
    .lean()
    .limit(limit)
    .select("-status -content")
    .populate({ path: "author", select: "avatar fullname username" })
    .populate({ path: "topics", options: { limit: 1 }, select: "name slug" })
    .sort({ createdAt: -1 });

  articles.forEach((article) => {
    article.author.avatar = addUrlToImg(article.author.avatar);
    article.img = addUrlToImg(article.img);
  });

  const skipID = articles.length > 0 ? articles[articles.length - 1]._id : null;

  res.status(200).json({ success: true, data: articles, skipID });
});

// ==================== get followed topic articles ==================== //

const getFollwedTopicArticles = asyncMiddleware(async (req, res, next) => {
  const { tag } = req.params;
  const { skip, limit = 15 } = req.query;

  const topic = await Topic.findOne({ slug: tag });

  if (!topic) throw new ErrorResponse(404, "topic not found");

  const query = { topics: topic._id, status: "approved" };

  if (skip) query._id = { $lt: skip };

  const articles = await Article.find(query)
    .lean()
    .limit(limit)
    .select("-status -content")
    .populate({ path: "author", select: "avatar fullname username" })
    .populate({ path: "topics", options: { limit: 1 }, select: "name slug" })
    .sort({ createdAt: -1 });

  articles.forEach((article) => {
    article.author.avatar = addUrlToImg(article.author.avatar);
    article.img = addUrlToImg(article.img);
  });

  const skipID = articles.length > 0 ? articles[articles.length - 1]._id : null;

  res.status(200).json({ success: true, data: articles, skipID });
});

// ==================== get followed authors articles ==================== //

const getFollwedAuthorsArticles = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { skip, limit = 15 } = req.query;

  const query = { author: { $ne: me._id }, status: "approved" };

  if (skip) query._id = { $lt: new mongoose.Types.ObjectId(skip) };

  const articles = await Article.aggregate()
    .sort({ createdAt: -1 })
    .match(query)
    .lookup({
      from: "followusers",
      localField: "author",
      foreignField: "following",
      as: "followedArticles",
    })
    .match({ "followedArticles.follower": me._id })
    .limit(parseInt(limit))
    .project("-followedArticles -status -content");

  const result = await Promise.all(
    articles.map(async (val) => {
      const populated = await Article.populate(
        val,
        { path: "author", select: "avatar fullname username" },
        { path: "topics", options: { limit: 1 }, select: "name slug" }
      );
      populated.author.avatar = addUrlToImg(populated.author.avatar);
      return populated;
    })
  );

  const skipID = articles.length > 0 ? articles[articles.length - 1]._id : null;

  res.status(200).json({ success: true, data: result, skipID });
});

// ==================== search topics ==================== //

const searchTopics = asyncMiddleware(async (req, res, next) => {
  const { search } = req.body;
  const { skip, limit = 15 } = req.query;

  let topics = [];

  if (search) {
    const query = { name: { $regex: search, $options: "i" } };

    if (skip) query._id = { $gt: skip };

    topics = await Topic.find(query).lean().limit(limit).sort({ _id: 1 });
  }

  const skipID = topics.length > 0 ? topics[topics.length - 1]._id : null;

  res.status(200).json({ success: true, data: topics, skipID });
});

// ==================== search articles ==================== //

const searchArticles = asyncMiddleware(async (req, res, next) => {
  const { search } = req.body;
  const { skip, limit = 15 } = req.query;

  let articles = [];

  if (search) {
    const query = { $text: { $search: search }, status: "approved" };

    if (skip) query._id = { $lt: skip };

    articles = await Article.find(query)
      .lean()
      .limit(limit)
      .select("-status -content")
      .populate({ path: "topics", options: { limit: 1 }, select: "name slug" })
      .populate({ path: "author", select: "avatar fullname username" })
      .sort({ createdAt: -1 });

    articles.forEach((article) => {
      article.author.avatar = addUrlToImg(article.author.avatar);
      article.img = addUrlToImg(article.img);
    });
  }

  const skipID = articles.length > 0 ? articles[articles.length - 1]._id : null;

  res.status(200).json({ success: true, data: articles, skipID });
});

module.exports = {
  createAnArticle,
  updateMyArticle,
  getAnArticle,
  countArticleLikes,
  countArticleComments,
  deleteMyArticle,
  getAllArticles,
  getFollwedTopicArticles,
  getFollwedAuthorsArticles,
  searchTopics,
  searchArticles,
};
