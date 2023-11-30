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

// ==================== like an article ==================== //
const likeAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findOne({
    where: { id, status: "approved" },
    attributes: ["id", "authorId"],
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  if (article.authorId === me.profileInfo.id) {
    throw ErrorResponse(400, "You can not like you own article");
  }

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

// ==================== get an article likers ==================== //
const getArticleLiker = asyncMiddleware(async (req, res, next) => {
  const me = req.me ? req.me : null;
  const { skip = 0, limit = 15 } = req.query;
  const { id } = req.params;

  const article = await Article.findOne({
    where: { id, status: "approved" },
    attributes: ["id", "authorId"],
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  let likeProfiles;

  let likers;

  if (!me) {
    likeProfiles = await Like.findAll({
      where: { articleId: article.id, id: { [Op.gt]: skip } },
      attributes: ["id"],
      include: [
        {
          model: Profile,
          as: "articleLike",
          attributes: ["id", "fullname", "avatar", "bio"],
          include: { model: User, as: "userInfo", attributes: ["username"] },
        },
      ],
      limit: Number(limit) ? Number(limit) : null,
    });
    likers = likeProfiles.map((likeProfile) => {
      likeProfile.articleLike.avatar = addUrlToImg(
        likeProfile.articleLike.avatar
      );
      return {
        id: likeProfile.articleLike.id,
        fullname: likeProfile.articleLike.fullname,
        avatar: likeProfile.articleLike.avatar,
        bio: likeProfile.articleLike.bio,
        username: likeProfile.articleLike.userInfo.username,
      };
    });
  }

  if (me && me.profileInfo.id === article.authorId) {
    likeProfiles = await Like.findAll({
      where: { articleId: article.id, id: { [Op.gt]: skip } },
      attributes: ["id"],
      include: [
        {
          model: Profile,
          as: "articleLike",
          attributes: ["id", "fullname", "avatar", "bio"],
          include: { model: User, as: "userInfo", attributes: ["username"] },
        },
      ],
      limit: Number(limit) ? Number(limit) : null,
    });
    likers = await Promise.all(
      likeProfiles.map(async (likeProfile) => {
        likeProfile.articleLike.avatar = addUrlToImg(
          likeProfile.articleLike.avatar
        );
        return {
          id: likeProfile.articleLike.id,
          fullname: likeProfile.articleLike.fullname,
          avatar: likeProfile.articleLike.avatar,
          bio: likeProfile.articleLike.bio,
          username: likeProfile.articleLike.userInfo.username,
          isFollowed: !!(await Follow_Profile.findOne({
            where: {
              followedId: likeProfile.articleLike.id,
              followerId: me.profileInfo.id,
            },
          })),
        };
      })
    );
  }

  if (me && me.profileInfo.id !== article.authorId) {
    likeProfiles = await Like.findAll({
      where: {
        articleId: article.id,
        id: { [Op.gt]: skip },
        "$likerBlocker.blockerId$": null,
        "$likerBlocked.blockedId$": null,
      },
      attributes: ["id"],
      include: [
        {
          model: Profile,
          as: "articleLike",
          attributes: ["id", "fullname", "avatar", "bio"],
          include: { model: User, as: "userInfo", attributes: ["username"] },
          where: { id: { [Op.ne]: me.profileInfo.id } },
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
      limit: Number(limit) ? Number(limit) : null,
    });
    likers = await Promise.all(
      likeProfiles.map(async (likeProfile) => {
        likeProfile.articleLike.avatar = addUrlToImg(
          likeProfile.articleLike.avatar
        );
        return {
          id: likeProfile.articleLike.id,
          fullname: likeProfile.articleLike.fullname,
          avatar: likeProfile.articleLike.avatar,
          bio: likeProfile.articleLike.bio,
          username: likeProfile.articleLike.userInfo.username,
          isFollowed: !!(await Follow_Profile.findOne({
            where: {
              followedId: likeProfile.articleLike.id,
              followerId: me.profileInfo.id,
            },
          })),
          isBlocked: !!(await Block.findOne({
            where: {
              blockedId: likeProfile.articleLike.id,
              blockerId: me.profileInfo.id,
            },
            attributes: ["id"],
          })),
        };
      })
    );
  }

  const newSkip =
    likeProfiles.length > 0 ? likeProfiles[likeProfiles.length - 1].id : null;

  res.json({
    success: true,
    data: likers,
    newSkip,
  });
});

export default { likeAnArticle, unLikeAnArticle, getArticleLiker };
