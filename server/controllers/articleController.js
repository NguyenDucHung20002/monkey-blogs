const Topic = require("../models/Topic");
const toSlug = require("../utils/toSlug");
const Article = require("../models/Article");
const addUrlToImg = require("../utils/addUrlToImg");
const { removeFile } = require("../utils/removeFile");
const FollowProfile = require("../models/FollowProfile");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== create article ==================== //

const createAnArticle = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;
  const { title, content, topics, preview } = req.body;
  console.log(
    "title, content, topics, preview:",
    title,
    content,
    topics,
    preview
  );

  const filename = req.file?.filename;
  if (!filename) {
    throw new ErrorResponse(422, "article image is required");
  }

  const slug = toSlug(title) + "-" + Date.now();

  const article = new Article({
    author: myProfile._id,
    title,
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
  const { title, content, topics, preview } = req.body;

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
    { title, slug: updatedSlug, img: filename, content, topics, preview },
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

  const response = { article };

  if (myProfile) {
    response.isMyArticle =
      myProfile._id.toString() === article.author._id.toString();
  }

  res.status(200).json({
    success: true,
    data: response,
  });
});

// ==================== get articles ==================== //

const getAllArticles = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;
  const { tag, feed } = req.query;

  const findQuery = {
    status: "approved",
  };

  if (tag) {
    const topic = await Topic.findOne({ slug: tag });
    if (!topic) {
      throw new ErrorResponse(404, "topic tag not found");
    }
    findQuery.topics = topic._id;
  }

  if (feed === "following") {
    const myFollowing = await FollowProfile.find({
      follower: myProfile._id,
    }).select("following");
    const myFollowingIds = myFollowing.map((follow) => follow.following);
    findQuery.author = { $in: myFollowingIds };
  }

  const articles = await Article.find(findQuery)
    .select("img title slug createdAt topics updatedAt preview")
    .populate({
      path: "topics",
      options: { limit: 1 },
      select: "name slug",
    })
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

module.exports = {
  createAnArticle,
  updateMyArticle,
  getAnArticle,
  deleteMyArticle,
  getAllArticles,
};
