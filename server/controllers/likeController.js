import Like from "../models/mysql/Like.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Article from "../models/mysql/Article.js";

// ==================== like an article ==================== //
const likeAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findOne({
    where: { id, status: "approved" },
    attributes: ["id"],
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  const like = await Like.findOne({
    where: { articleId: article.id, profileId: me.profileInfo.id },
    attributes: ["id"],
  });

  if (!like) {
    await Promise.all([
      Like.create({ articleId: article.id, profileId: me.profileInfo.id }),
      article.increment({ likesCount: 1 }),
    ]);
  }

  res.json({ success: true, message: "Successfully liked the article" });
});

// ==================== unlike an article ==================== //
const unLikeAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findOne({
    where: { id, status: "approved" },
    attributes: ["id"],
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  const like = await Like.findOne({
    where: { articleId: article.id, profileId: me.profileInfo.id },
    attributes: ["id"],
  });

  if (like) {
    await Promise.all([like.destroy(), article.increment({ likesCount: -1 })]);
  }

  res.json({ success: true, message: "Successfully unliked the article" });
});

export default { likeAnArticle, unLikeAnArticle };
