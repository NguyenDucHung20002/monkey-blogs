const Topic = require("../models/Topic");
const toSlug = require("../utils/toSlug");
const Profile = require("../models/Profile");
const Article = require("../models/Article");
const { removeFile } = require("../utils/removeFile");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// create an article
const createAnArticle = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;
  const { title, content, topics } = req.body;

  const filename = req.file?.filename;
  if (!filename) {
    throw new ErrorResponse(422, "article image is required");
  }

  const profile = await Profile.findOne({ user });
  if (!profile) {
    throw new ErrorResponse(404, "profile not found");
  }

  const slug = toSlug(title) + "-" + Date.now();

  const article = new Article({
    author: profile._id,
    title,
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

// update an article
const updateMyArticle = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;
  const { slug } = req.params;
  const { title, content, topics } = req.body;

  const filename = req.file?.filename;

  const profile = await Profile.findOne({ user });
  if (!profile) {
    throw new ErrorResponse(404, "profile not found");
  }

  const oldArticle = await Article.findOne({ author: profile._id, slug });
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
    { author: profile._id, slug },
    { title, slug: updatedSlug, img: filename, content, topics },
    { new: true }
  );

  if (filename) {
    removeFile(oldArticle.img);
  }

  res.status(200).json({
    success: true,
  });
});

// delete an article
const deleteMyArticle = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;
  const { slug } = req.params;

  const profile = await Profile.findOne({ user });
  if (!profile) {
    throw new ErrorResponse(404, "profile not found");
  }

  const article = await Article.findOneAndDelete({ author: profile._id, slug });
  if (article) {
    removeFile(article.img);
  }

  res.status(200).json({
    success: true,
  });
});

// get an article
const getAnArticle = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const article = await Article.findOne({ slug })
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

  res.status(200).json({
    success: true,
    data: article,
  });
});

// get all articles
const getAllArticles = asyncMiddleware(async (req, res, next) => {
  const article = await Article.find()
    .select("title createdAt updatedAt")
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "avatar fullname username",
    });

  res.status(200).json({
    success: true,
    data: article,
  });
});

// get articles by topic
const getArticlesByTopic = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;

  const topic = await Topic.findOne({ slug });
  if (!topic) {
    throw new ErrorResponse(404, "topic not found");
  }

  const articlesByTopic = await Article.find({ topics: topic._id })
    .select("title createdAt updatedAt")
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "avatar fullname username",
    });

  res.status(200).json({
    success: true,
    data: articlesByTopic,
  });
});

module.exports = {
  createAnArticle,
  updateMyArticle,
  getAnArticle,
  deleteMyArticle,
  getAllArticles,
  getArticlesByTopic,
};
