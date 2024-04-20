import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Article from "../models/mysql/Article.js";
import Reading_History from "../models/mysql/Reading_History.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import Article_Topic from "../models/mysql/Article_Topic.js";
import Topic from "../models/mysql/Topic.js";

// ==================== delete an article in reading history ==================== //

const deleteAnArticleInReadingHistory = asyncMiddleware(
  async (req, res, next) => {
    const me = req.me;
    const { id } = req.params;

    await Reading_History.destroy({
      where: { articleId: id, profileId: me.profileInfo.id },
    });

    res.json({
      success: true,
      message: "Article deleted successfully from reading history.",
    });
  }
);

// ==================== clear reading history ==================== //

const clearReadingHistory = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  await Reading_History.destroy({ where: { profileId: me.profileInfo.id } });

  res.json({
    success: true,
    message: "Reading history cleared successfully.",
  });
});

// ==================== get reading history ==================== //

const getReadingHistory = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { profileId: me.profileInfo.id };

  if (skip) whereQuery.updatedAt = { [Op.lt]: skip };

  const readingHistory = await Reading_History.findAll({
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

  const result = await Promise.all(
    readingHistory.map(async (readingHistory) => {
      const dataTopic = await Article_Topic.findOne({
        attributes: [],
        where: { articleId: readingHistory.readArticle.id },
        include: {
          model: Topic,
          as: "topic",
          attributes: ["id", "name", "slug"],
          where: { status: "approved" },
        },
        order: [["id", "ASC"]],
      });

      readingHistory.readArticle.banner = readingHistory.readArticle.banner
        ? addUrlToImg(readingHistory.readArticle.banner)
        : null;

      return {
        ...readingHistory.readArticle.toJSON(),
        topic: dataTopic?.topic,
      };
    })
  );

  const newSkip =
    readingHistory.length > 0
      ? readingHistory[readingHistory.length - 1].updatedAt
      : null;

  res.json({
    success: true,
    data: result,
    newSkip,
  });
});

export default {
  deleteAnArticleInReadingHistory,
  clearReadingHistory,
  getReadingHistory,
};
