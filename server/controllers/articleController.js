const Like = require("../models/Like");
const Topic = require("../models/Topic");
const toSlug = require("../utils/toSlug");
const Article = require("../models/Article");
const FollowUser = require("../models/FollowUser");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { removeFile } = require("../utils/removeFile");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== create article ==================== //

const createAnArticle = asyncMiddleware(async (req, res, next) => {
  const myUserId = req.myProfile._id;
  const { title, preview, content, topics } = req.body;

  const filename = req.file?.filename;
  if (!filename) {
    throw new ErrorResponse(422, "article image is required");
  }

  const slug = toSlug(title) + "-" + Date.now();

  const article = new Article({
    author: myUserId,
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
  const myUserId = req.myProfile._id;
  const { slug } = req.params;
  const { title, preview, content, topics } = req.body;

  const filename = req.file?.filename;

  const oldArticle = await Article.findOne({ slug })
    .lean()
    .select("_id slug img");
  if (!oldArticle) {
    throw new ErrorResponse(404, "article not found");
  }

  console.log(oldArticle);

  let updatedSlug;

  if (title) {
    updatedSlug = toSlug(title) + "-" + Date.now();
  } else {
    updatedSlug = oldArticle.slug;
  }

  await Article.findOneAndUpdate(
    { author: myUserId, slug },
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
  const myUserId = req.myProfile._id;
  const { slug } = req.params;

  const article = await Article.findOneAndDelete({
    author: myUserId,
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
    .lean()
    .select("-status")
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

  article.img = addUrlToImg(article.img);
  article.author.avatar = addUrlToImg(article.author.avatar);

  const likes = await Like.find({ article: article._id }).lean().select("user");

  const result = { article, likeCount: likes.length };

  if (myProfile) {
    result.isMyArticle =
      myProfile._id.toString() === article.author._id.toString();
    if (!result.isMyArticle) {
      result.authorFollowing = (await FollowUser.exists({
        follower: myProfile._id,
        following: article.author._id,
      }))
        ? true
        : false;
    }
    const likeIds = likes.map((like) => like.user.toString());
    result.isLiked = likeIds.includes(myProfile._id);
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

// ==================== get all articles ==================== //

const getAllArticles = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;
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
      follower: myProfile._id,
    })
      .lean()
      .select("following");
    const myFollowingIds = myFollowing.map((follow) => follow.following);
    findQuery.author = { $in: myFollowingIds };
  }

  const articles = await Article.find(findQuery)
    .lean()
    .select("-status -content")
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

// ==================== search topics for create article ==================== //

const searchTopics = asyncMiddleware(async (req, res, next) => {
  const { search } = req.body;

  let topics = [];

  if (search) {
    topics = await Topic.find({ name: new RegExp(search, "i") }).lean();
  }

  const topicsWithCounts = await Promise.all(
    topics.map(async (topic) => {
      const followersCount = await FollowTopic.countDocuments({
        topic: topic._id,
      });
      return {
        ...topic,
        followersCount,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: topicsWithCounts,
  });
});

// ==================== search articles ==================== //

const searchArticles = asyncMiddleware(async (req, res, next) => {
  const { search } = req.body;

  let articles = [];

  if (search) {
    articles = await Article.find({
      title: new RegExp(search, "i"),
      status: "approved",
    })
      .lean()
      .select("-status -content")
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
