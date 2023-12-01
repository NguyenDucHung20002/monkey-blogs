import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Article from "../models/mysql/Article.js";
import Reading_List from "../models/mysql/Reading_List.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import ErrorResponse from "../responses/ErrorResponse.js";

// ==================== add an article to reading list ==================== //
const addToReadingList = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findByPk(id, {
    attributes: ["id"],
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  const readingList = await Reading_List.findOne({
    where: { articleId: article.id, profileId: me.profileInfo.id },
    attributes: ["id"],
  });

  if (!readingList) {
    await Reading_List.create({
      articleId: article.id,
      profileId: me.profileInfo.id,
    });
  }

  res.json({
    success: true,
    message: "Article added to your reading list successfully",
  });
});

// ==================== remove an article from reading list ==================== //
const removeFromReadingList = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  await Reading_List.destroy({
    where: { articleId: id, profileId: me.profileInfo.id },
  });

  res.json({
    success: true,
    message: "Article removed from reading list successfully",
  });
});

export default {};
