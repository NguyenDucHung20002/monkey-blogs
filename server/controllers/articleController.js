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
import extracImg from "../utils/extractImg.js";
import replaceImgUrlsWithNames from "../utils/replaceImgUrlsWithNames.js";

// ==================== create draft ==================== //
const createADraft = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { title, content } = req.body;

  const slug = toSlug(title) + "-" + Date.now();

  replaceImgUrlsWithNames(content);

  const draft = await Article.create({
    authorId: me.profileInfo.id,
    title,
    content,
    slug,
  });

  res.status(201).json({
    success: true,
    message: "Draft created successfully",
    draftId: draft.id,
  });
});

// ==================== update draft ==================== //
const updateADraft = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { title, content } = req.body;

  const draft = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: "draft" },
  });

  if (!draft) throw ErrorResponse(404, "Draft not found");

  const updatedSlug = title ? toSlug(title) + "-" + Date.now() : draft.slug;

  replaceImgUrlsWithNames(content);

  await draft.update({ title, content, slug: updatedSlug }, { hooks: false });

  res.json({ success: true, message: "Draft updated successfully" });
});

// ==================== delete draft ==================== //
const deleteADraft = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const draft = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: "draft" },
  });

  if (!draft) throw ErrorResponse(404, "Draft not found");

  const imgList = extracImg(draft.content);

  imgList.forEach((img) => {
    fileController.autoRemoveImg(img);
  });

  await Article.destroy({
    where: { id, authorId: me.profileInfo.id },
    force: true,
  });

  res.json({ success: true, message: "Draft deleted successfully" });
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

  if (data.status === "draft") {
    console.log("hello world");
    data = {
      id: data.id,
      title: data.title,
      content: data.content,
    };
  }

  if (data.status === "approved") {
    data = {
      id: data.id,
      title: data.title,
      preview: data.preview,
      content: data.content,
    };
  }

  res.json({ success: true, data });
});

// ==================== get my draft ==================== //
const getMyDrafts = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  const whereQuery = { authorId: me.profileInfo.id, status: "draft" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const drafts = await Article.findAll({
    where: whereQuery,
    attributes: ["id", "title", "createdAt", "updatedAt"],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = drafts.length > 0 ? drafts[drafts.length - 1].id : null;

  res.json({ success: true, data: drafts, newSkip });
});

// ==================== create article ==================== //
const createArticle = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const me = req.me;
  const { preview, banner, topicNames } = req.body;

  const draft = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: "draft" },
  });

  if (!draft) throw ErrorResponse(404, "Draft not found");

  await draft.update({ banner, preview, status: "approved" }, { hooks: false });

  if (topicNames) {
    const data = await Promise.all(
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
  const { title, preview, content, banner, topicNames } = req.body;

  const article = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: "approved" },
    attributes: ["id", "banner"],
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  if (banner !== article.banner) {
    const oldArticleBanner = article.banner;
    fileController.autoRemoveImg(oldArticleBanner);
  }

  const updatedSlug = title ? toSlug(title) + "-" + Date.now() : article.slug;

  await article.update({
    title,
    preview,
    slug: updatedSlug,
    content,
    banner,
  });

  if (topicNames) {
    const data = await Promise.all(
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

  const article = await Article.findOne({
    where: { id, authorId: me.profileInfo.id, status: "approved" },
  });

  const imgList = extracImg(article.content);

  imgList.forEach((img) => {
    fileController.autoRemoveImg(img);
  });

  await article.destroy({ force: true });

  res.json({ success: true, message: "Article deleted successfully" });
});

// ==================== get profile articles ==================== //
const getProfileArticles = asyncMiddleware(async (req, res, next) => {
  const me = req.me ? req.me : null;
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
        "reportsCount",
      ],
    },
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  if (!me) {
    articles = await Promise.all(
      articles.map(async (article) => {
        article.banner ? addUrlToImg(article.banner) : null;
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
  }

  if (me && me.profileInfo.id === user.profileInfo.id) {
    articles = await Promise.all(
      articles.map(async (article) => {
        article.banner ? addUrlToImg(article.banner) : null;
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
            isMyArticle: true,
          };
        }
        return { ...article.toJSON(), topic: null, isMyArticle: true };
      })
    );
  }

  if (me && me.profileInfo.id !== user.profileInfo.id) {
    articles = await Promise.all(
      articles.map(async (article) => {
        article.banner ? addUrlToImg(article.banner) : null;
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
        const isSaved = !!(await Reading_List.findOne({
          where: { profileId: me.profileInfo.id, articleId: article.id },
        }));
        if (topic) {
          return {
            ...article.toJSON(),
            topic: {
              id: topic.topic.id,
              name: topic.topic.name,
              slug: topic.topic.slug,
            },
            isMyArticle: false,
            isSaved,
          };
        }
        return {
          ...article.toJSON(),
          topic: null,
          isMyArticle: false,
          isSaved,
        };
      })
    );
  }

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({ success: true, articles, newSkip });
});

// ==================== get an article ==================== //
const getAnArticle = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const me = req.me ? req.me : null;

  let article = await Article.findOne({
    where: { slug, status: "approved" },
    attributes: {
      exclude: [
        "approvedById",
        "preview",
        "slug",
        "authorId",
        "status",
        "reportsCount",
      ],
    },
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
  article.banner ? addUrlToImg(article.banner) : null;

  if (me && me.profileInfo.id === article.author.id) {
    article = { ...article.toJSON(), isMyArticle: true };
  }

  if (me && me.profileInfo.id !== article.author.id) {
    const isBlockedByUser = !!(await Block.findOne({
      where: { blockedId: me.profileInfo.id, blockerId: article.author.id },
    }));

    if (isBlockedByUser) {
      return res.json({
        success: true,
        message: `You can not view this article because the author already blocked you`,
      });
    }

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
      where: {
        articleId: article.id,
        profileId: me.profileInfo.id,
      },
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
        "reportsCount",
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
      const isSaved = !!(await Reading_List.findOne({
        where: { profileId: me.profileInfo.id, articleId: article.id },
      }));
      return topic
        ? {
            ...article.toJSON(),
            topic: {
              id: topic.topic.id,
              name: topic.topic.name,
              slug: topic.topic.slug,
            },
            isSaved,
          }
        : { ...article.toJSON(), topic: null, isSaved };
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
    where: { slug, status: "approved" },
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
        "reportsCount",
      ],
    },
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
      return { ...article.toJSON(), topic, isSaved };
    })
  );

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({ success: true, data: articles, newSkip });
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
      { authorId: { [Op.ne]: me.profileInfo.id } },
      { status: "approved" },
    ],
  };

  if (skip) whereQuery[Op.and].push({ id: { [Op.lt]: skip } });

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
        "reportsCount",
      ],
    },
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
      const isSaved = !!(await Reading_List.findOne({
        where: { profileId: me.profileInfo.id, articleId: article.id },
      }));
      return topic
        ? {
            ...article.toJSON(),
            topic: {
              id: topic.topic.id,
              name: topic.topic.name,
              slug: topic.topic.slug,
            },
            isSaved,
          }
        : { ...article.toJSON(), topic: null, isSaved };
    })
  );

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({ success: true, data: articles, newSkip });
});

// ==================== admin pick ==================== //
const adminPick = asyncMiddleware(async (req, res, next) => {
  const { limit = 3 } = req.query;
  const me = req.me;

  let articles = await Reading_List.findAll({
    where: {
      "$readArticle.authorMuted.mutedId$": null,
      "$readArticle.authorBlocked.blockedId$": null,
      "$readArticle.authorBlocker.blockerId$": null,
    },
    attributes: {
      exclude: [
        "authorId",
        "content",
        "likesCount",
        "commentsCount",
        "approvedById",
        "status",
        "reportsCount",
      ],
    },
    include: [
      {
        model: Article,
        attributes: ["id", "title", "slug"],
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
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 3,
  });

  articles = articles.map((article) => {
    return {
      id: article.readArticle.id,
      title: article.readArticle.title,
      slug: article.readArticle.slug,
      author: {
        id: article.readArticle.author.id,
        fullname: article.readArticle.author.fullname,
        avatar: addUrlToImg(article.readArticle.author.avatar),
        username: article.readArticle.author.userInfo.username,
        role: article.readArticle.author.userInfo.role.slug,
      },
    };
  });

  res.json({ success: true, data: articles });
});

// ==================== admin pick full list ==================== //
const adminPickFullList = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;
  const me = req.me;

  let whereQuery = {
    "$readArticle.authorMuted.mutedId$": null,
    "$readArticle.authorBlocked.blockedId$": null,
    "$readArticle.authorBlocker.blockerId$": null,
  };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const adminPickList = await Reading_List.findAll({
    where: whereQuery,
    attributes: ["id"],
    include: [
      {
        model: Article,
        attributes: {
          exclude: [
            "authorId",
            "content",
            "likesCount",
            "commentsCount",
            "approvedById",
            "status",
            "reportsCount",
          ],
        },
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
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const articles = await Promise.all(
    adminPickList.map(async (adminPick) => {
      const topic = await Article_Topic.findOne({
        attributes: [],
        where: { articleId: adminPick.id },
        include: {
          model: Topic,
          as: "topic",
          attributes: ["id", "name", "slug"],
          where: { status: "approved" },
        },
        order: [["id", "ASC"]],
      });
      const article = {
        id: adminPick.readArticle.id,
        banner: adminPick.readArticle.banner
          ? addUrlToImg(adminPick.readArticle.banner)
          : null,
        title: adminPick.readArticle.title,
        preview: adminPick.readArticle.preview,
        slug: adminPick.readArticle.slug,
        createdAt: adminPick.readArticle.createdAt,
        updatedAt: adminPick.readArticle.updatedAt,
        author: {
          id: adminPick.readArticle.author.id,
          fullname: adminPick.readArticle.author.fullname,
          avatar: addUrlToImg(adminPick.readArticle.author.avatar),
          username: adminPick.readArticle.author.userInfo.username,
          role: adminPick.readArticle.author.userInfo.role.slug,
        },
      };
      const isSaved = !!(await Reading_List.findOne({
        where: { profileId: me.profileInfo.id, articleId: adminPick.id },
      }));

      return topic
        ? {
            ...article,
            topic: {
              id: topic.topic.id,
              name: topic.topic.name,
              slug: topic.topic.slug,
            },
            isSaved,
          }
        : { ...article, topic: null, isSaved };
    })
  );

  const newSkip =
    adminPickList.length > 0
      ? adminPickList[adminPickList.length - 1].id
      : null;

  res.json({ success: true, data: articles, newSkip });
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
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  articles.forEach((article) => {
    article.author.avatar = addUrlToImg(article.author.avatar);
  });

  const newSkip = articles.length > 0 ? articles[articles.length - 1].id : null;

  res.json({ success: true, data: articles, newSkip });
});

// ==================== article to draft ==================== //
const articleToDraft = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;

  const article = await Article.findOne({ id, status: { [Op.ne]: "draft" } });

  if (!article) throw ErrorResponse(404, "Article not found");

  await article.update({ status: "draft" }, { hooks: false });

  res.json({ success: true, message: "Set article back to draft" });
});

export default {
  createADraft,
  updateADraft,
  deleteADraft,
  getAnArticleOrADraftToEdit,
  getMyDrafts,
  createArticle,
  updateArticle,
  deleteArticle,
  getProfileArticles,
  getAllArticles,
  getAnArticle,
  getFollowedProfilesArticles,
  getFollowedTopicArticles,
  exploreNewArticles,
  adminPick,
  adminPickFullList,
  articleToDraft,
};
