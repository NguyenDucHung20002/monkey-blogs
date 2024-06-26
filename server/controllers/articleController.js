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
import Reading_History from "../models/mysql/Reading_History.js";
import Reading_List from "../models/mysql/Reading_List.js";
import fileController from "../controllers/fileController.js";
import Role from "../models/mysql/Role.js";
import toUpperCase from "../utils/toUpperCase.js";
import sequelize from "../databases/mysql/connect.js";
import extractImg from "../utils/extractImg.js";
import replaceImgUrlsWithNames from "../utils/replaceImgUrlsWithNames.js";
import replaceImgNamesWithUrls from "../utils/replaceImgNamesWithUrls.js";

// ==================== create a draft ==================== //

const createADraft = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { title, content } = req.body;

  const slug = toSlug(title) + "-" + Date.now();

  const draft = await Article.create({
    authorId: me.profileInfo.id,
    title,
    content: replaceImgUrlsWithNames(content),
    slug,
  });

  res.status(201).json({
    success: true,
    message: "Draft created successfully",
    draftId: draft.id,
  });
});

// ==================== update a draft ==================== //

const updateADraft = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { title, content } = req.body;

  const draft = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: "draft" },
  });

  if (!draft) throw ErrorResponse(404, "Draft not found");

  const updatedSlug = title ? toSlug(title) + "-" + Date.now() : draft.slug;

  await draft.update(
    { title, content: replaceImgUrlsWithNames(content), slug: updatedSlug },
    { hooks: false }
  );

  res.json({
    success: true,
    message: "Draft updated successfully",
  });
});

// ==================== delete a draft ==================== //

const deleteADraft = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const draft = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: "draft" },
    include: { model: Topic, as: "articleTopics", through: { attributes: [] } },
  });

  if (draft) {
    const contentImgs = extractImg(draft.content);

    await Promise.all([
      contentImgs.forEach(async (img) => {
        await fileController.autoRemoveAnImage(img);
      }),
      draft.articleTopics.forEach(async (articleTopic) => {
        await articleTopic.increment({ articlesCount: -1 });
      }),
      draft.destroy({ force: true, hooks: false }),
      fileController.autoRemoveAnImage(draft.banner),
    ]);
  }

  res.json({
    success: true,
    message: "Draft deleted successfully",
  });
});

// ==================== get an article or a draft to edit ==================== //

const getAnArticleOrADraftToEdit = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  let data = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: { [Op.ne]: "rejected" } },
    include: {
      model: Topic,
      as: "articleTopics",
      through: { attributes: [] },
      attributes: ["id", "name", "slug"],
    },
  });

  if (!data) throw ErrorResponse(404, "Not found");

  data.content = replaceImgNamesWithUrls(data.content);

  res.json({
    success: true,
    data,
  });
});

// ==================== get all drafts ==================== //

const getAllDrafts = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  const whereQuery = {
    authorId: me.profileInfo.id,
    status: "draft",
  };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const drafts = await Article.findAll({
    where: whereQuery,
    attributes: ["id", "title", "createdAt", "updatedAt"],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = drafts.length > 0 ? drafts[drafts.length - 1].id : null;

  res.json({
    success: true,
    data: drafts,
    newSkip,
  });
});

// ==================== create an article ==================== //

const createAnArticle = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const me = req.me;
  const { preview, banner, topicNames } = req.body;

  const draft = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: "draft" },
    include: { model: Topic, as: "articleTopics", through: { attributes: [] } },
  });

  if (!draft) throw ErrorResponse(404, "Draft not found");

  const operation =
    me.role.id === 3
      ? draft.update({ banner, preview, status: "approved" }, { hooks: false })
      : draft.update({ banner, preview, status: "pending" });

  await operation;

  if (topicNames) {
    const newTopics = await Promise.all(
      topicNames.map(async (topicName) => {
        let isExisted = await Topic.findOne({ where: { name: topicName } });
        if (!isExisted) {
          const slug = toSlug(topicName);
          const name = toUpperCase(topicName);
          isExisted = await Topic.create({ name, slug });
        }
        return { articleId: draft.id, topicId: isExisted.id };
      })
    );

    await Promise.all([
      Article_Topic.destroy({
        where: { articleId: draft.id },
        oldTopics: draft.articleTopics,
      }),
      Article_Topic.bulkCreate(newTopics),
    ]);
  }

  res.json({
    success: true,
    message: "Article created successfully",
  });
});

// ==================== update an article ==================== //

const updateAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { title, preview, content, banner, topicNames } = req.body;

  const article = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: "approved" },
    include: { model: Topic, as: "articleTopics", through: { attributes: [] } },
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  if (banner !== article.banner) {
    fileController.autoRemoveAnImage(article.banner);
  }

  const updatedSlug = title ? toSlug(title) + "-" + Date.now() : article.slug;

  const updateArticle = {
    title,
    preview,
    slug: updatedSlug,
    content: replaceImgUrlsWithNames(content),
    banner,
  };

  const operation =
    me.role.id === 3
      ? article.update(updateArticle, { hooks: false })
      : article.update(updateArticle);

  await operation;

  if (topicNames) {
    const newTopics = await Promise.all(
      topicNames.map(async (topicName) => {
        let isExisted = await Topic.findOne({ where: { name: topicName } });
        if (!isExisted) {
          const slug = toSlug(topicName);
          const name = toUpperCase(topicName);
          isExisted = await Topic.create({ name, slug });
        }
        return { articleId: article.id, topicId: isExisted.id };
      })
    );

    await Article_Topic.destroy({
      where: { articleId: article.id },
      oldTopics: article.articleTopics,
    });

    await Article_Topic.bulkCreate(newTopics);
  }

  res.json({
    success: true,
    message: "Article updated successfully",
  });
});

// ==================== delete an article ==================== //

const deleteAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: "approved" },
    include: { model: Topic, as: "articleTopics", through: { attributes: [] } },
  });

  if (article) {
    const contentImgs = extractImg(article.content);

    await Promise.all([
      contentImgs.forEach(async (img) => {
        await fileController.autoRemoveAnImage(img);
      }),
      article.articleTopics.forEach(async (articleTopic) => {
        await articleTopic.increment({ articlesCount: -1 });
      }),
      fileController.autoRemoveAnImage(article.banner),
      article.destroy({ force: true, hooks: false }),
    ]);
  }

  res.json({
    success: true,
    message: "Article deleted successfully",
  });
});

// ==================== get profile articles ==================== //

const getProfileArticles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;
  const { skip, limit = 15 } = req.query;

  let whereQuery = {
    authorId: user.profileInfo.id,
    status: "approved",
  };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  let articles = await Article.findAll({
    where: whereQuery,
    attributes: [
      "id",
      "banner",
      "title",
      "preview",
      "slug",
      "createdAt",
      "updatedAt",
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  articles = await Promise.all(
    articles.map(async (article) => {
      article.banner ? addUrlToImg(article.banner) : null;

      const topicData = await Article_Topic.findOne({
        where: { articleId: article.id },
        include: {
          model: Topic,
          as: "topic",
          attributes: ["id", "name", "slug"],
          where: { status: "approved" },
        },
        order: [["id", "ASC"]],
      });

      const processedArticle = {
        ...article.toJSON(),
        topic: {
          id: topicData?.topic?.id,
          name: topicData?.topic?.name,
          slug: topicData?.topic?.slug,
        },
      };

      if (me.profileInfo.id !== user.profileInfo.id) {
        const isSaved = !!(await Reading_List.findOne({
          where: { profileId: me.profileInfo.id, articleId: article.id },
        }));

        processedArticle.isSaved = isSaved;
        processedArticle.isMyArticle = false;
      } else {
        processedArticle.isMyArticle = true;
      }

      return processedArticle;
    })
  );

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({
    success: true,
    articles,
    newSkip,
  });
});

// ==================== get an article ==================== //

const getAnArticle = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const me = req.me;

  let article = await Article.findOne({
    where: { slug, status: "approved" },
    attributes: [
      "id",
      "banner",
      "title",
      "content",
      "likesCount",
      "commentsCount",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
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
  article.banner = article.banner ? addUrlToImg(article.banner) : null;
  article.content = replaceImgNamesWithUrls(article.content);

  if (me.profileInfo.id === article.author.id) {
    article = { ...article.toJSON(), isMyArticle: true };
  }

  if (me.profileInfo.id !== article.author.id) {
    const isBlockedByUser = !!(await Block.findOne({
      where: { blockedId: me.profileInfo.id, blockerId: article.author.id },
    }));

    if (isBlockedByUser) throw ErrorResponse(400, `Author already blocked you`);

    const [authorBlocked, authorFollowed, articleLiked, isSaved] =
      await Promise.all([
        Block.findOne({
          where: { blockedId: article.author.id, blockerId: me.profileInfo.id },
        }),
        Follow_Profile.findOne({
          where: {
            followedId: article.author.id,
            followerId: me.profileInfo.id,
          },
        }),
        Like.findOne({
          where: { articleId: article.id, profileId: me.profileInfo.id },
        }),
        Reading_List.findOne({
          where: { profileId: me.profileInfo.id, articleId: article.id },
        }),
      ]);

    const isInReadingHistory = await Reading_History.findOne({
      where: { articleId: article.id, profileId: me.profileInfo.id },
    });

    if (!isInReadingHistory) {
      await Reading_History.create({
        articleId: article.id,
        profileId: me.profileInfo.id,
      });
    } else {
      isInReadingHistory.changed("updatedAt", true);
      await isInReadingHistory.update({ updatedAt: new Date() });
    }

    article = {
      ...article.toJSON(),
      isMyArticle: false,
      authorBlocked: !!authorBlocked,
      authorFollowed: !!authorFollowed,
      articleLiked: !!articleLiked,
      isSaved: !!isSaved,
    };
  }

  res.json({
    success: true,
    data: article,
  });
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
    attributes: [
      "id",
      "banner",
      "title",
      "preview",
      "slug",
      "createdAt",
      "updatedAt",
    ],
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
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  articles = await Promise.all(
    articles.map(async (article) => {
      article.banner ? addUrlToImg(article.banner) : null;
      article.author.avatar = addUrlToImg(article.author.avatar);

      const dataTopic = await Article_Topic.findOne({
        where: { articleId: article.id },
        include: {
          model: Topic,
          as: "topic",
          attributes: ["id", "name", "slug"],
          where: { status: "approved" },
        },
        order: [["id", "ASC"]],
      });

      const isSaved = !!(await Reading_List.findOne({
        where: { profileId: me.profileInfo.id, articleId: article.id },
      }));

      return {
        ...article.toJSON(),
        topic: dataTopic?.topic,
        isSaved,
      };
    })
  );

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({
    success: true,
    data: articles,
    newSkip,
  });
});

// ==================== get followed topic articles ==================== //

const getFollowedTopicArticles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;
  const { slug } = req.params;

  const topic = await Topic.findOne({ where: { slug, status: "approved" } });

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
    attributes: [
      "id",
      "banner",
      "title",
      "preview",
      "slug",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
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
      article.banner ? addUrlToImg(article.banner) : null;
      article.author.avatar = addUrlToImg(article.author.avatar);

      const isSaved = !!(await Reading_List.findOne({
        where: { profileId: me.profileInfo.id, articleId: article.id },
      }));

      return {
        ...article.toJSON(),
        isSaved,
      };
    })
  );

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({
    success: true,
    data: articles,
    newSkip,
  });
});

// ==================== explore new articles ==================== //

const exploreNewArticles = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;
  const me = req.me;

  let whereQuery = {
    [Op.and]: [
      sequelize.literal(`
        NOT EXISTS (
          SELECT 1
          FROM articles_topics a_t
          LEFT JOIN follow_topics ft ON a_t.topicId = ft.topicId
          WHERE Article.id = a_t.articleId AND ft.profileId = ${me.profileInfo.id}
        )
      `),
      { "$authorBlocked.blockedId$": null },
      { "$authorBlocker.blockerId$": null },
      { "$authorFollowed.followedId$": null },
      { "$authorMuted.mutedId$": null },
      { "$readingHistory.articleId$": null },
      { authorId: { [Op.ne]: me.profileInfo.id } },
      { status: "approved" },
    ],
  };

  if (skip) whereQuery[Op.and].push({ id: { [Op.lt]: skip } });

  let articles = await Article.findAll({
    where: whereQuery,
    attributes: [
      "id",
      "banner",
      "title",
      "preview",
      "slug",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
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
      {
        model: Reading_History,
        as: "readingHistory",
        where: { profileId: me.profileInfo.id },
        attributes: [],
        required: false,
      },
      {
        model: Follow_Profile,
        as: "authorFollowed",
        where: { followerId: me.profileInfo.id },
        attributes: [],
        required: false,
      },
      {
        model: Mute,
        as: "authorMuted",
        where: { muterId: me.profileInfo.id },
        attributes: [],
        required: false,
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
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  articles = await Promise.all(
    articles.map(async (article) => {
      article.banner ? addUrlToImg(article.banner) : null;
      article.author.avatar = addUrlToImg(article.author.avatar);

      const dataTopic = await Article_Topic.findOne({
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

      const isSaved = !!(await Reading_List.findOne({
        where: { profileId: me.profileInfo.id, articleId: article.id },
      }));

      return {
        ...article.toJSON(),
        topic: dataTopic?.topic,
        isSaved,
      };
    })
  );

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({
    success: true,
    data: articles,
    newSkip,
  });
});

// ==================== admin pick ==================== //

const adminPick = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;
  const me = req.me;

  let whereQuery = {
    "$readArticle.authorMuted.mutedId$": null,
    "$readArticle.authorBlocked.blockedId$": null,
    "$readArticle.authorBlocker.blockerId$": null,
  };

  if (skip) whereQuery.createdAt = { [Op.lt]: skip };

  const adminPickList = await Reading_List.findAll({
    where: whereQuery,
    attributes: ["id", "createdAt"],
    include: [
      {
        model: Article,
        attributes: [
          "id",
          "banner",
          "title",
          "preview",
          "slug",
          "createdAt",
          "updatedAt",
        ],
        as: "readArticle",
        include: [
          {
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
          {
            model: Mute,
            as: "authorMuted",
            where: { muterId: me.profileInfo.id },
            attributes: [],
            required: false,
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
      },
      {
        model: Profile,
        as: "readingProfile",
        attributes: [],
        required: true,
        include: {
          model: User,
          as: "userInfo",
          required: true,
          include: { model: Role, as: "role", where: { slug: "admin" } },
        },
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const result = await Promise.all(
    adminPickList.map(async (adminPick) => {
      const topicData = await Article_Topic.findOne({
        attributes: [],
        where: { articleId: adminPick.readArticle.id },
        include: {
          model: Topic,
          as: "topic",
          attributes: ["id", "name", "slug"],
          where: { status: "approved" },
        },
        order: [["id", "ASC"]],
      });

      adminPick.readArticle.banner = adminPick.readArticle.banner
        ? addUrlToImg(adminPick.readArticle.banner)
        : null;
      adminPick.readArticle.author.avatar = addUrlToImg(
        adminPick.readArticle.author.avatar
      );

      const isSaved = !!(await Reading_List.findOne({
        where: {
          profileId: me.profileInfo.id,
          articleId: adminPick.readArticle.id,
        },
      }));

      return {
        ...adminPick.readArticle.toJSON(),
        topic: {
          id: topicData?.topic?.id,
          name: topicData?.topic?.name,
          slug: topicData?.topic?.slug,
        },
        isSaved,
        isMyArticle: me.profileInfo.id === adminPick.readArticle.author.id,
      };
    })
  );

  const newSkip =
    adminPickList.length > 0
      ? adminPickList[adminPickList.length - 1].createdAt
      : null;

  res.json({
    success: true,
    data: result,
    newSkip,
  });
});

// ==================== get all articles ==================== //

const getAllArticles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15, search, option } = req.query;

  let whereQuery = {
    [Op.and]: [
      { status: { [Op.notIn]: ["pending", "draft"] } },
      { authorId: { [Op.ne]: me.profileInfo.id } },
    ],
  };

  if (skip) whereQuery[Op.and].push({ id: { [Op.lt]: skip } });

  if (option) whereQuery[Op.and].push({ status: { [Op.eq]: option } });

  if (search) {
    whereQuery[Op.or] = [
      { "$author.fullname$": { [Op.substring]: search } },
      { "$author.userInfo.username$": { [Op.substring]: search } },
      { title: { [Op.substring]: search } },
      { slug: { [Op.substring]: search } },
    ];
  }

  const articles = await Article.findAll({
    where: whereQuery,
    attributes: [
      "id",
      "title",
      "slug",
      "reportsCount",
      "rejectsCount",
      "status",
    ],
    include: [
      {
        model: Profile,
        as: "author",
        attributes: ["id", "fullname"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
      {
        model: User,
        as: "approvedBy",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({
    success: true,
    data: articles,
    newSkip,
  });
});

// ==================== get topic articles ==================== //

const getTopicArticles = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;
  const { slug } = req.params;
  const me = req.me;

  const topic = await Topic.findOne({ where: { slug } });

  if (!topic) throw ErrorResponse(404, "Topic not found");

  let whereQuery = { topicId: topic.id };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  whereQuery["$article.authorMuted.mutedId$"] = null;
  whereQuery["$article.authorBlocked.blockedId$"] = null;
  whereQuery["$article.authorBlocker.blockerId$"] = null;

  const topicArticles = await Article_Topic.findAll({
    where: whereQuery,
    attributes: ["id"],
    include: {
      model: Article,
      as: "article",
      where: { status: "approved", authorId: { [Op.ne]: me.profileInfo.id } },
      attributes: [
        "id",
        "banner",
        "title",
        "preview",
        "slug",
        "likesCount",
        "commentsCount",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
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
        {
          model: Mute,
          as: "authorMuted",
          where: { muterId: me.profileInfo.id },
          attributes: [],
          required: false,
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
    },
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : null,
  });

  const articles = await Promise.all(
    topicArticles.map(async (topicArticle) => {
      topicArticle.article.author.avatar = addUrlToImg(
        topicArticle.article.author.avatar
      );
      topicArticle.article.banner = addUrlToImg(topicArticle.article.banner);

      const [isSaved, isLiked] = await Promise.all([
        Reading_List.findOne({
          where: {
            profileId: me.profileInfo.id,
            articleId: topicArticle.article.id,
          },
        }),
        Like.findOne({
          where: {
            profileId: me.profileInfo.id,
            articleId: topicArticle.article.id,
          },
        }),
      ]);

      return {
        ...topicArticle.article.toJSON(),
        isSaved: Boolean(isSaved),
        isLiked: Boolean(isLiked),
        isMyArticle: me.profileInfo.id === topicArticle.article.id,
      };
    })
  );

  const newSkip =
    topicArticles.length > 0
      ? topicArticles[topicArticles.length - 1].id
      : null;

  res.json({
    success: true,
    data: articles,
    newSkip,
  });
});

// ==================== set an article back to draft ==================== //

const setAnArticleBackToDraft = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;
  const me = req.me;

  const article = await Article.findOne({
    where: { id, status: { [Op.notIn]: ["draft", "pending"] } },
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  await article.update({ status: "draft" }, { me: me, reason: reason });

  res.json({
    success: true,
    message: "Set article back to draft",
  });
});

// ==================== approve an article ==================== //

const approveAnArticle = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const me = req.me;

  const article = await Article.findOne({
    where: { id, status: { [Op.notIn]: ["draft", "pending"] } },
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  if (article.status === "approved") {
    throw ErrorResponse(400, "Article already approved");
  }

  await article.update({ status: "approved", approvedById: me.id }, { me: me });

  res.json({
    success: true,
    message: "Article approved successfully",
  });
});

// ==================== remove an article ==================== //

const removeAnArticle = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const me = req.me;

  const article = await Article.findOne({
    where: { id, status: { [Op.notIn]: ["draft", "pending"] } },
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  await article.update({ deletedById: me.id }, { hooks: false });

  await article.destroy({ me: me });

  res.json({
    success: true,
    message: "Article removed successfully",
  });
});

// ==================== restore an article ==================== //

const restoreAnArticle = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const me = req.me;

  const article = await Article.findOne({
    where: { id, status: { [Op.notIn]: ["draft", "pending"] } },
    paranoid: false,
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  await article.update({ deletedById: null }, { hooks: false });

  await article.restore({ me: me });

  res.json({
    success: true,
    message: "Article restored successfully",
  });
});

// ==================== get removed articles ==================== //

const getRemovedArticles = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15, search } = req.query;

  let whereQuery = { deletedAt: { [Op.ne]: null } };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  if (search) {
    whereQuery[Op.or] = [
      { "$author.fullname$": { [Op.substring]: search } },
      { "$author.userInfo.username$": { [Op.substring]: search } },
      { title: { [Op.substring]: search } },
      { slug: { [Op.substring]: search } },
    ];
  }

  const articles = await Article.findAll({
    where: whereQuery,
    paranoid: false,
    attributes: [
      "id",
      "title",
      "slug",
      "status",
      "reportsCount",
      "rejectsCount",
      "deletedAt",
    ],
    include: [
      {
        model: Profile,
        as: "author",
        attributes: ["id", "fullname"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["name", "slug"] },
        },
      },
      {
        model: User,
        as: "approvedBy",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
      {
        model: User,
        as: "deletedBy",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : null,
  });

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({
    success: true,
    data: articles,
    newSkip,
  });
});

// ==================== get an article detail ==================== //

const getAnArticleDetail = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;

  const article = await Article.findOne({
    where: { id },
    attributes: ["id", "banner", "title", "content", "createdAt", "updatedAt"],
    include: [
      {
        model: Profile,
        as: "author",
        attributes: ["id", "fullname", "avatar"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: {
            model: Role,
            as: "role",
            attributes: ["id", "name", "slug"],
          },
        },
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
  article.banner = article.banner ? addUrlToImg(article.banner) : null;
  article.content = replaceImgNamesWithUrls(article.content);

  res.json({
    success: true,
    data: article,
  });
});

// ==================== get more articles from author ==================== //

const getMoreArticlesFromAuthor = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const me = req.me;

  const profileArticle = await Article.findByPk(id);

  if (!profileArticle) throw ErrorResponse(404, "Article not found");

  let articles = await Article.findAll({
    where: {
      status: "approved",
      id: { [Op.ne]: id },
      authorId: profileArticle.authorId,
    },
    attributes: [
      "id",
      "banner",
      "title",
      "preview",
      "slug",
      "likesCount",
      "commentsCount",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
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
    ],
    order: [["likesCount", "DESC"]],
    limit: 4,
  });

  articles = await Promise.all(
    articles.map(async (article) => {
      article.author.avatar = addUrlToImg(article.author.avatar);
      article.banner = addUrlToImg(article.banner);

      const [isSaved, isLiked] = await Promise.all([
        Reading_List.findOne({
          where: {
            profileId: me.profileInfo.id,
            articleId: article.id,
          },
        }),
        Like.findOne({
          where: {
            profileId: me.profileInfo.id,
            articleId: article.id,
          },
        }),
      ]);

      return {
        ...article.toJSON(),
        isSaved: Boolean(isSaved),
        isLiked: Boolean(isLiked),
        isMyArticle: me.profileInfo.id === article.id,
      };
    })
  );

  res.json({
    success: true,
    data: articles,
  });
});

export default {
  createADraft,
  updateADraft,
  deleteADraft,
  getAnArticleOrADraftToEdit,
  getAllDrafts,
  createAnArticle,
  updateAnArticle,
  deleteAnArticle,
  getProfileArticles,
  getAllArticles,
  getAnArticle,
  getFollowedProfilesArticles,
  getFollowedTopicArticles,
  exploreNewArticles,
  adminPick,
  getTopicArticles,
  setAnArticleBackToDraft,
  removeAnArticle,
  getRemovedArticles,
  approveAnArticle,
  restoreAnArticle,
  getAnArticleDetail,
  getMoreArticlesFromAuthor,
};
