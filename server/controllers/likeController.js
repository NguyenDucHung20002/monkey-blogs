import Like from "../models/mysql/Like.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Article from "../models/mysql/Article.js";
import { Op } from "sequelize";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import Block from "../models/mysql/Block.js";
import Follow_Profile from "../models/mysql/Follow_Profile.js";
import Role from "../models/mysql/Role.js";

// ==================== like an article ==================== //

const likeAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findOne({ where: { id, status: "approved" } });

  if (!article) throw ErrorResponse(404, "Article not found");

  if (article.authorId === me.profileInfo.id) {
    throw ErrorResponse(400, "Cannot like you own article");
  }

  const like = await Like.findOne({
    where: { articleId: article.id, profileId: me.profileInfo.id },
  });

  if (!like) {
    await Like.create(
      { articleId: article.id, profileId: me.profileInfo.id },
      { me: me, article: article }
    );
  }

  res.json({
    success: true,
    message: "Successfully liked the article",
  });
});

// ==================== unlike an article ==================== //

const unLikeAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findOne({ where: { id, status: "approved" } });

  if (!article) throw ErrorResponse(404, "Article not found");

  const like = await Like.findOne({
    where: { articleId: article.id, profileId: me.profileInfo.id },
  });

  if (like) {
    await like.destroy({ me: me, article: article });
  }

  res.json({
    success: true,
    message: "Successfully unlike the article",
  });
});

// ==================== get likers of an article ==================== //

const getLikersOfAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip = 0, limit = 15 } = req.query;
  const { id } = req.params;

  const article = await Article.findOne({ where: { id, status: "approved" } });

  if (!article) throw ErrorResponse(404, "Article not found");

  let likeProfiles;

  likeProfiles = await Like.findAll({
    where: {
      articleId: article.id,
      id: { [Op.gt]: skip },
      profileId: { [Op.ne]: me.profileInfo.id },
      "$likerBlocker.blockerId$": null,
      "$likerBlocked.blockedId$": null,
    },
    attributes: ["id"],
    include: [
      {
        model: Profile,
        as: "articleLike",
        attributes: ["id", "fullname", "avatar", "bio"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
      {
        model: Block,
        as: "likerBlocker",
        where: { blockedId: me.profileInfo.id },
        attributes: [],
        required: false,
      },
      {
        model: Block,
        as: "likerBlocked",
        attributes: [],
        where: { blockerId: me.profileInfo.id },
        required: false,
      },
    ],
    order: [["id", "ASC"]],
    limit: Number(limit) ? Number(limit) : null,
  });

  likeProfiles = await Promise.all(
    likeProfiles.map(async (likeProfile) => {
      const isFollowed = !!(await Follow_Profile.findOne({
        where: {
          followedId: likeProfile.articleLike.id,
          followerId: me.profileInfo.id,
        },
      }));

      likeProfile.articleLike.avatar = addUrlToImg(
        likeProfile.articleLike.avatar
      );

      return {
        ...likeProfile.articleLike.toJSON(),
        isFollowed,
      };
    })
  );

  const newSkip =
    likeProfiles.length > 0 ? likeProfiles[likeProfiles.length - 1].id : null;

  res.json({
    success: true,
    data: likeProfiles,
    newSkip,
  });
});

export default {
  likeAnArticle,
  unLikeAnArticle,
  getLikersOfAnArticle,
};
