import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import toSlug from "../utils/toSlug.js";
import Article from "../models/mysql/Article.js";
import Topic from "../models/mysql/Topic.js";
import Article_Topic from "../models/mysql/Article_Topic.js";
import { Op } from "sequelize";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import Follow_Profile from "../models/mysql/Follow_Profile.js";
import Block from "../models/mysql/Block.js";
import Like from "../models/mysql/Like.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import Mute from "../models/mysql/Mute.js";
import History_Reading from "../models/mysql/History_Reading.js";

// ==================== create article ==================== //
const createArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { title, preview, content, topicNames } = req.body;

  const slug = toSlug(title) + "-" + Date.now();

  const article = await Article.create({
    authorId: me.profileInfo.id,
    title,
    preview,
    slug,
    content,
  });

  if (topicNames) {
    const data = await Promise.all(
      topicNames.map(async (topicName) => {
        let isExisted = await Topic.findOne({ where: { name: topicName } });
        if (!isExisted) {
          const slug = toSlug(topicName);
          isExisted = await Topic.create({ name: topicName, slug });
        }
        return { articleId: article.id, topicId: isExisted.id };
      })
    );
    await Article_Topic.bulkCreate(data);
  }

  res.status(201).json({
    success: true,
    message: "Article created successfully",
  });
});

// ==================== update article ==================== //
const updateArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { title, preview, content, topicNames } = req.body;

  const article = await Article.findOne({
    where: { id, authorId: me.profileInfo.id },
    attributes: ["id"],
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  const updatedSlug = title ? toSlug(title) + "-" + Date.now() : article.slug;

  await article.update({
    title,
    preview,
    slug: updatedSlug,
    content,
  });

  if (topicNames) {
    const data = await Promise.all(
      topicNames.map(async (topicName) => {
        let isExisted = await Topic.findOne({ where: { name: topicName } });
        if (!isExisted) {
          const slug = toSlug(topicName);
          isExisted = await Topic.create({ name: topicName, slug });
        }
        return { articleId: article.id, topicId: isExisted.id };
      })
    );
    await Promise.all([
      Article_Topic.destroy({ where: { articleId: article.id } }),
      Article_Topic.bulkCreate(data),
    ]);
  }

  res.json({ success: true, message: "Article updated successfully" });
});

// ==================== delete article ==================== //
const deleteArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  await Article.destroy({ where: { id, authorId: me.profileInfo.id } });

  res.json({ success: true, message: "Article deleted successfully" });
});

// ==================== get my pending articles ==================== //
const getMyPendingArticles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  const whereQuery = { authorId: me.profileInfo.id, status: "pending" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const pendingArticles = await Article.findAll({
    where: whereQuery,
    attributes: ["id", "title", "slug", "createdAt", "updatedAt"],
    order: [["id", "DESC"]],
    limit: Number(limit) ? limit : 15,
  });

  const newSkip =
    pendingArticles.length > 0
      ? pendingArticles[pendingArticles.length - 1].id
      : null;

  res.json({ success: true, data: pendingArticles, newSkip });
});

// ==================== get my approved articles ==================== //
const getMyApprovedArticles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  const whereQuery = { authorId: me.profileInfo.id, status: "pending" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const approvedArticles = await Article.findAll({
    where: whereQuery,
    attributes: ["id", "title", "slug", "createdAt", "updatedAt"],
    order: [["id", "DESC"]],
    limit: Number(limit) ? limit : 15,
  });

  const newSkip =
    approvedArticles.length > 0
      ? approvedArticles[approvedArticles.length - 1].id
      : null;

  res.json({ success: true, data: approvedArticles, newSkip });
});

// ==================== get profile articles ==================== //
const getProfileArticles = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { authorId: user.profileInfo.id, status: "approved" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  let articles = await Article.findAll({
    where: whereQuery,
    attributes: {
      exclude: [
        "authorId",
        "content",
        "status",
        "likesCount",
        "commentsCount",
        "approvedById",
      ],
    },
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  articles = await Promise.all(
    articles.map(async (article) => {
      const topic = await Article_Topic.findOne({
        attributes: [],
        where: { articleId: article.id },
        include: {
          model: Topic,
          as: "topic",
          attributes: ["id", "name", "slug"],
          where: { status: "approved" },
        },
        order: [["id", "ASC"]],
      });
      if (topic) {
        return {
          ...article.toJSON(),
          topic: {
            id: topic.topic.id,
            name: topic.topic.name,
            slug: topic.topic.slug,
          },
        };
      }
      return { ...article.toJSON(), topic: null };
    })
  );

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({ success: true, articles, newSkip });
});

// ==================== get all articles ==================== //
const getAllArticles = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;

  let whereQuery = {};

  if (skip) whereQuery.where = { id: { [Op.lt]: skip } };

  const articles = await Article.findAll({
    where: whereQuery,
    attributes: {
      exclude: ["content", "likesCount", "commentsCount", "banner", "authorId"],
    },
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({ success: true, data: articles, newSkip });
});

// ==================== get an article ==================== //
const getAnArticle = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const me = req.me ? req.me : null;

  let article = await Article.findOne({
    where: { slug, status: "approved" },
    attributes: {
      exclude: ["approvedById", "preview", "slug", "authorId", "status"],
    },
    include: [
      {
        model: Profile,
        as: "author",
        attributes: ["id", "fullname", "avatar"],
        include: { model: User, as: "userInfo", attributes: ["username"] },
      },
      {
        model: Topic,
        as: "articleTopics",
        through: { attributes: [] },
        attributes: ["id", "name", "slug"],
        where: { status: "approved" },
        required: false,
      },
    ],
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  article.author.avatar = addUrlToImg(article.author.avatar);

  if (me && me.profileInfo.id === article.author.id) {
    article = { ...article.toJSON(), isMyArticle: true };
  }

  if (me && me.profileInfo.id !== article.author.id) {
    const isBlockedByUser = !!(await Block.findOne({
      where: { blockedId: me.profileInfo.id, blockerId: article.author.id },
      attributes: ["id"],
    }));

    if (isBlockedByUser) {
      return res.json({
        success: true,
        message: `You can not view this article because the author already blocked you`,
      });
    }
    const [authorBlocked, authorFollowed, articleLiked] = await Promise.all([
      Block.findOne({
        where: { blockedId: article.author.id, blockerId: me.profileInfo.id },
      }),
      Follow_Profile.findOne({
        where: { followedId: article.author.id, followerId: me.profileInfo.id },
      }),
      Like.findOne({
        where: { articleId: article.id, profileId: me.profileInfo.id },
      }),
    ]);

    const isInHistoryReading = await History_Reading.findOne({
      where: {
        articleId: article.id,
        profileId: me.profileInfo.id,
      },
      attributes: ["id", "updatedAt"],
    });

    if (!isInHistoryReading) {
      await History_Reading.create({
        articleId: article.id,
        profileId: me.profileInfo.id,
      });
    } else {
      isInHistoryReading.changed("updatedAt", true);
      await isInHistoryReading.update({ updatedAt: new Date() });
    }

    article = {
      ...article.toJSON(),
      authorBlocked: !!authorBlocked,
      authorFollowed: !!authorFollowed,
      articleLiked: !!articleLiked,
    };
  }

  res.json({ success: true, data: article });
});

// ==================== get followed profiles articles ==================== //
const getFollowedProfilesArticles = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;
  const me = req.me;

  let whereQuery = {
    authorId: { [Op.ne]: me.profileInfo.id },
    status: "approved",
    "$authorMuted.mutedId$": null,
  };

  if (skip) whereQuery = { id: { [Op.lt]: skip } };

  let articles = await Article.findAll({
    where: whereQuery,
    attributes: {
      exclude: [
        "authorId",
        "content",
        "likesCount",
        "commentsCount",
        "approvedById",
        "status",
      ],
    },
    include: [
      {
        model: Follow_Profile,
        as: "authorFollowed",
        where: { followerId: me.profileInfo.id },
        attributes: [],
      },
      {
        model: Mute,
        as: "authorMuted",
        where: { muterId: me.profileInfo.id },
        attributes: [],
        required: false,
      },
      {
        model: Profile,
        as: "author",
        attributes: ["id", "fullname", "avatar"],
        include: { model: User, as: "userInfo", attributes: ["username"] },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  articles = await Promise.all(
    articles.map(async (article) => {
      article.author.avatar = addUrlToImg(article.author.avatar);
      const topic = await Article_Topic.findOne({
        attributes: [],
        where: { articleId: article.id },
        include: {
          model: Topic,
          as: "topic",
          attributes: ["id", "name", "slug"],
          where: { status: "approved" },
        },
        order: [["id", "ASC"]],
      });
      if (topic) {
        return {
          ...article.toJSON(),
          topic: {
            id: topic.topic.id,
            name: topic.topic.name,
            slug: topic.topic.slug,
          },
        };
      }
      return { ...article.toJSON(), topic: null };
    })
  );

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({ success: true, data: articles, newSkip });
});

// ==================== get followed topic articles ==================== //
const getFollowedTopicArticles = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;
  const { slug } = req.params;
  const me = req.me;

  const topic = await Topic.findOne({
    where: { slug },
    attributes: ["id", "name", "slug"],
  });

  if (!topic) throw ErrorResponse(404, "Topic not found");

  let whereQuery = {
    authorId: { [Op.ne]: me.profileInfo.id },
    status: "approved",
    "$authorBlocked.blockedId$": null,
    "$authorBlocker.blockerId$": null,
  };

  if (skip) whereQuery = { id: { [Op.lt]: skip } };

  let articles = await Article.findAll({
    where: whereQuery,
    attributes: {
      exclude: [
        "authorId",
        "content",
        "likesCount",
        "commentsCount",
        "approvedById",
        "status",
      ],
    },
    include: [
      {
        model: Profile,
        as: "author",
        attributes: ["id", "fullname", "avatar"],
        include: { model: User, as: "userInfo", attributes: ["username"] },
      },
      {
        model: Topic,
        as: "articleTopics",
        where: { id: topic.id },
        attributes: [],
      },
      {
        model: Block,
        as: "authorBlocker",
        where: { blockedId: me.profileInfo.id },
        attributes: [],
        required: false,
      },
      {
        model: Block,
        as: "authorBlocked",
        attributes: [],
        where: { blockerId: me.profileInfo.id },
        required: false,
      },
    ],
    subQuery: false,
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  articles = await Promise.all(
    articles.map(async (article) => {
      article.author.avatar = addUrlToImg(article.author.avatar);
      return { ...article.toJSON(), topic };
    })
  );

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({ success: true, data: articles, newSkip });
});

export default {
  createArticle,
  updateArticle,
  deleteArticle,
  getMyPendingArticles,
  getMyApprovedArticles,
  getProfileArticles,
  getAllArticles,
  getAnArticle,
  getFollowedProfilesArticles,
  getFollowedTopicArticles,
};
