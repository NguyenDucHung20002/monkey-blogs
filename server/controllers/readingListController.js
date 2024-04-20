import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Article from "../models/mysql/Article.js";
import Reading_List from "../models/mysql/Reading_List.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Profile from "../models/mysql/Profile.js";
import Topic from "../models/mysql/Topic.js";
import User from "../models/mysql/User.js";
import Article_Topic from "../models/mysql/Article_Topic.js";
import Role from "../models/mysql/Role.js";

// ==================== add an article to reading list ==================== //

const addAnArticleToReadingList = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findByPk(id);

  if (!article) throw ErrorResponse(404, "Article not found");

  if (article.authorId === me.profileInfo.id) {
    throw ErrorResponse(400, "Cannot add you own article");
  }

  const readingList = await Reading_List.findOne({
    where: { articleId: article.id, profileId: me.profileInfo.id },
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

// ==================== remove an article in reading list ==================== //

const removeAnArticleInReadingList = asyncMiddleware(async (req, res, next) => {
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

// ==================== get reading list ==================== //

const getReadingList = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { profileId: me.profileInfo.id };

  if (skip) whereQuery.createdAt = { [Op.lt]: skip };

  const readingList = await Reading_List.findAll({
    where: whereQuery,
    attributes: ["id", "createdAt"],
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
      include: {
        model: Profile,
        as: "author",
        attributes: ["id", "fullname", "avatar"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
    },
    order: [["createdAt", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const result = await Promise.all(
    readingList.map(async (readingList) => {
      const dataTopic = await Article_Topic.findOne({
        attributes: [],
        where: { articleId: readingList.readArticle.id },
        include: {
          model: Topic,
          as: "topic",
          attributes: ["id", "name", "slug"],
          where: { status: "approved" },
        },
        order: [["id", "ASC"]],
      });

      readingList.readArticle.banner = readingList.readArticle.banner
        ? addUrlToImg(readingList.readArticle.banner)
        : null;

      readingList.readArticle.author.avatar = addUrlToImg(
        readingList.readArticle.author.avatar
      );

      return {
        ...readingList.readArticle.toJSON(),
        topic: dataTopic?.topic,
      };
    })
  );

  const newSkip =
    readingList.length > 0
      ? readingList[readingList.length - 1].createdAt
      : null;

  res.json({
    success: true,
    data: result,
    newSkip,
  });
});

export default {
  addAnArticleToReadingList,
  removeAnArticleInReadingList,
  getReadingList,
};
