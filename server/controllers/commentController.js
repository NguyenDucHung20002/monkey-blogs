import Comment from "../models/mysql/Comment.js";
import Article from "../models/mysql/Article.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Profile from "../models/mysql/Profile.js";
import Block from "../models/mysql/Block.js";
import User from "../models/mysql/User.js";
import { Op } from "sequelize";
import Role from "../models/mysql/Role.js";

// ==================== create a comment ==================== //

const createAComment = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { parentCommentId, content } = req.body;

  const article = await Article.findByPk(id);

  if (!article) throw ErrorResponse(404, "Article not found");

  const parentComment = parentCommentId
    ? await Comment.findByPk(parentCommentId)
    : null;

  if (parentCommentId && !parentComment) {
    throw ErrorResponse(404, "Comment not found");
  }

  if (parentComment) {
    await parentComment.increment({ repliesCount: 1 });
  }

  const isAuthor = me.profileInfo.id === article.authorId;

  const newComment = await Comment.create(
    {
      articleId: article.id,
      authorId: me.profileInfo.id,
      parentCommentId: parentCommentId ? parentComment.id : null,
      depth: parentCommentId ? parentComment.depth + 1 : 1,
      content,
    },
    {
      me: me,
      article: article,
      isAuthor,
      parentComment: parentComment,
    }
  );

  res.status(201).json({
    success: true,
    data: {
      ...newComment.toJSON(),
      author: {
        id: me.profileInfo.id,
        fullname: me.profileInfo.fullname,
        avatar: me.profileInfo.avatar,
        userInfo: {
          username: me.username,
          role: {
            slug: me.role.slug,
          },
        },
      },
      isAuthor,
      isMyComment: true,
    },
  });
});

// ==================== update a comment ==================== //

const updateAComment = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { content } = req.body;

  const comment = await Comment.findOne({
    where: { id, authorId: me.profileInfo.id },
  });

  if (!comment) throw ErrorResponse(404, "Comment not found");

  await comment.update({ content });

  res.json({
    success: true,
    message: "Comment updated successfully",
  });
});

// ==================== delete a comment ==================== //

const deleteAComment = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const deleteCommentAndReplies = async (comment) => {
    const replyComments = await Comment.findAll({
      where: { parentCommentId: comment.id },
    });

    await Promise.all(
      replyComments.map(async (replyComment) => {
        deleteCommentAndReplies(replyComment);
        Comment.destroy({ where: { id: replyComment.id } });
        Article.increment(
          { commentsCount: -1 },
          { where: { id: replyComment.articleId } }
        );
      })
    );
  };

  const comment = await Comment.findOne({
    where: { id, authorId: me.profileInfo.id },
  });

  if (comment) {
    await Promise.all([
      deleteCommentAndReplies(comment),
      comment.destroy(),
      Article.increment(
        { commentsCount: -1 },
        { where: { id: comment.articleId } }
      ),
      Comment.increment(
        { repliesCount: -1 },
        { where: { id: comment.parentCommentId } }
      ),
    ]);
  }

  res.json({
    success: true,
    message: "Comment deleted successfully",
  });
});

// ==================== get main comments of an article ==================== //

const getMainCommentsOfAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { skip, limit = 15 } = req.query;

  const article = await Article.findByPk(id);

  if (!article) throw ErrorResponse(404, "Article not found");

  let whereQuery = { articleId: article.id, depth: 1 };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  whereQuery["$authorBlocker.blockerId$"] = null;
  whereQuery["$authorBlocked.blockedId$"] = null;

  let comments = await Comment.findAll({
    where: whereQuery,
    attributes: { exclude: ["articleId"] },
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
        model: Block,
        as: "authorBlocker",
        where: { blockedId: me.profileInfo.id },
        attributes: [],
        required: false,
      },
      {
        model: Block,
        as: "authorBlocked",
        where: { blockerId: me.profileInfo.id },
        attributes: [],
        required: false,
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : null,
  });

  comments = comments.map((comment) => {
    const isAuthor = comment.authorId === article.authorId;
    const isMyComment = me.profileInfo.id === comment.authorId;

    comment.author.avatar = addUrlToImg(comment.author.avatar);

    return {
      ...comment.toJSON(),
      isAuthor,
      isMyComment,
    };
  });

  const newSkip = comments.length > 0 ? comments[comments.length - 1].id : null;

  res.json({
    success: true,
    data: comments,
    newSkip,
  });
});

// ==================== get nested comments of a comment ==================== //

const getNestedCommentsOfAComment = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { skip, limit = 15 } = req.query;

  const parentComment = await Comment.findByPk(id);

  if (!parentComment) throw ErrorResponse(404, "Comment not found");

  const article = await Article.findByPk(parentComment.articleId);

  if (!article) throw ErrorResponse(404, "Article not found");

  let whereQuery = { parentCommentId: parentComment.id };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  whereQuery["$authorBlocker.blockerId$"] = null;
  whereQuery["$authorBlocked.blockedId$"] = null;

  let replyComments = await Comment.findAll({
    where: whereQuery,
    attributes: { exclude: ["articleId"] },
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
        model: Block,
        as: "authorBlocker",
        where: { blockedId: me.profileInfo.id },
        attributes: [],
        required: false,
      },
      {
        model: Block,
        as: "authorBlocked",
        where: { blockerId: me.profileInfo.id },
        attributes: [],
        required: false,
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : null,
  });

  replyComments = replyComments.map((replyComment) => {
    const isAuthor = replyComment.authorId === article.authorId;
    const isMyComment = me.profileInfo.id === replyComment.authorId;

    replyComment.author.avatar = addUrlToImg(replyComment.author.avatar);

    return {
      ...replyComment.toJSON(),
      isAuthor,
      isMyComment,
    };
  });

  const newSkip =
    replyComments.length > 0
      ? replyComments[replyComments.length - 1].id
      : null;

  res.json({
    success: true,
    data: replyComments,
    newSkip,
  });
});

export default {
  createAComment,
  updateAComment,
  deleteAComment,
  getMainCommentsOfAnArticle,
  getNestedCommentsOfAComment,
};
