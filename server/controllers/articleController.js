const toSlug = require("../utils/toSlug");
const Profile = require("../models/Profile");
const Article = require("../models/Article");
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

module.exports = { createAnArticle };
