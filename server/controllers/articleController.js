import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import toSlug from "../utils/toSlug.js";
import Article from "../models/mysql/Article.js";
import Topic from "../models/mysql/Topic.js";
import Article_Topic from "../models/mysql/Article_Topic.js";

// ==================== create article ==================== //
const createArticle = asyncMiddleware(async (req, res, next) => {
  const myUser = req.user;
  const { title, preview, content, topicNames } = req.body;

  const slug = toSlug(title) + "-" + Date.now();

  const article = await Article.create({
    authorId: myUser.profileInfo.id,
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
  const myUser = req.user;
  const { id } = req.params;
  const { title, preview, content, topicNames } = req.body;

  const article = await Article.findOne({
    where: { id, authorId: myUser.profileInfo.id },
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
  const myUser = req.user;
  const { id } = req.params;

  await Article.destroy({ where: { id, authorId: myUser.profileInfo.id } });

  res.json({ success: true, message: "Article deleted successfully" });
});

// ==================== get my pending articles ==================== //
const getMyPendingArticles = asyncMiddleware(async (req, res, next) => {
  const myUser = req.user;
  const { skip, limit = 15 } = req.query;

  const whereQuery = { authorId: myUser.profileInfo.id, status: "pending" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const pendingArticles = await Article.findAll({
    where: whereQuery,
    attributes: ["id", "title", "slug", "createdAt", "updatedAt"],
    order: [["id", "DESC"]],
    limit: Number(limit) && Number.isInteger(limit) ? limit : 15,
  });

  const newSkip =
    pendingArticles.length > 0
      ? pendingArticles[pendingArticles.length - 1].id
      : null;

  res.json({ success: true, data: pendingArticles, newSkip });
});

// ==================== get my approved articles ==================== //
const getMyApprovedArticles = asyncMiddleware(async (req, res, next) => {
  const myUser = req.user;
  const { skip, limit = 15 } = req.query;

  const whereQuery = { authorId: myUser.profileInfo.id, status: "pending" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const approvedArticles = await Article.findAll({
    where: whereQuery,
    attributes: ["id", "title", "slug", "createdAt", "updatedAt"],
    order: [["id", "DESC"]],
    limit: Number(limit) && Number.isInteger(limit) ? limit : 15,
  });

  const newSkip =
    approvedArticles.length > 0
      ? approvedArticles[approvedArticles.length - 1].id
      : null;

  res.json({ success: true, data: approvedArticles, newSkip });
});

export default {
  createArticle,
  updateArticle,
  deleteArticle,
  getMyPendingArticles,
  getMyApprovedArticles,
};
