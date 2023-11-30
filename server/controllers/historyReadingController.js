import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Article from "../models/mysql/Article.js";
import History_Reading from "../models/mysql/History_Reading.js";
import addUrlToImg from "../utils/addUrlToImg.js";

// ==================== delete an article in history reading ==================== //
const deleteAnArticleInHistory = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  await History_Reading.destroy({
    where: { articleId: id, profileId: me.profileInfo.id },
  });

  res.json({
    success: true,
    message: "Article deleted successfully from reading history.",
  });
});

// ==================== clear my history reading ==================== //
const clearMyHistoryReading = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  await History_Reading.destroy({ where: { profileId: me.profileInfo.id } });

  res.json({
    success: true,
    message: "Reading history cleared successfully.",
  });
});

// ==================== get history reading ==================== //
const getMyHistoryReading = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { profileId: me.profileInfo.id };

  if (skip) whereQuery.updatedAt = { [Op.lt]: skip };

  const historyReading = await History_Reading.findAll({
    where: whereQuery,
    attributes: ["id", "updatedAt"],
    include: {
      model: Article,
      as: "readArticle",
      attributes: [
        "id",
        "banner",
        "title",
        "preview",
        "slug",
        "createdAt",
        "updatedAt",
      ],
    },
    order: [["updatedAt", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const articles = historyReading.map((historyReading) => {
    return {
      id: historyReading.readArticle.id,
      banner: historyReading.readArticle.banner
        ? addUrlToImg(historyReading.readArticle.banner)
        : null,
      title: historyReading.readArticle.title,
      preview: historyReading.readArticle.preview,
      slug: historyReading.readArticle.slug,
      createdAt: historyReading.readArticle.createdAt,
      updatedAt: historyReading.readArticle.updatedAt,
    };
  });

  const newSkip =
    historyReading.length > 0
      ? historyReading[historyReading.length - 1].updatedAt
      : null;

  res.json({ success: true, data: articles, newSkip });
});

export default {
  deleteAnArticleInHistory,
  clearMyHistoryReading,
  getMyHistoryReading,
};
