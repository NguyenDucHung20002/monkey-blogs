const Comment = require("../models/Comment");
const Article = require("../models/Article");
const addUrlToImg = require("../utils/addUrlToImg");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== add comment ==================== //

const addComment = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { slug } = req.params;
  const { parentCommentId, content } = req.body;

  const article = await Article.exists({ slug });
  if (!article) {
    throw new ErrorResponse(404, "Article not found");
  }

  const data = {
    article: article._id,
    author: me._id,
    content,
  };

  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId)
      .lean()
      .select("_id depth");
    if (!parentComment) {
      throw new ErrorResponse(404, "Comment not found");
    }

    data.parentCommentId = parentComment._id;
    data.depth = parentComment.depth + 1;
  }

  const comment = new Comment(data);

  await comment.save();

  res.status(201).json({
    success: true,
  });
});

// ==================== update comment ==================== //

const updateComment = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { id } = req.params;
  const { content } = req.body;

  await Comment.findOneAndUpdate({ _id: id, author: me._id }, { content });

  res.status(200).json({
    success: true,
  });
});

// ==================== delete comment ==================== //

const deleteComment = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { id } = req.params;

  const comment = await Comment.findOne({ _id: id, author: me._id })
    .lean()
    .select("_id");

  if (comment) {
    await deleteCommentAndReplies(comment);

    await Comment.deleteOne({ _id: comment._id });
  }

  res.status(200).json({
    success: true,
  });
});

// ==================== get article main comments ==================== //

const getMainComments = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { slug } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const article = await Article.findOne({ slug }).lean().select("_id author");
  if (!article) {
    throw new ErrorResponse(404, "Article not found");
  }

  const comments = await commentList(me, article, null, skip, limit);
  res.status(200).json({
    success: true,
    data: comments,
  });
});

// ==================== get article comment nested comments of main comment ==================== //

const getNestedComments = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { id, slug } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const article = await Article.findOne({ slug }).lean().select("_id author");
  if (!article) {
    throw new ErrorResponse(404, "Article not found");
  }

  const parentComment = await Comment.findById(id).lean().select("_id");
  if (!parentComment) {
    throw new ErrorResponse(404, "Comment not found");
  }

  const nestedComments = await commentList(
    me,
    article,
    parentComment._id,
    skip,
    limit
  );

  res.status(200).json({
    success: true,
    data: nestedComments,
  });
});

// -------------------- comment list function -------------------- //

async function commentList(me, article, parentCommentId, skip, limit) {
  const comments = await Comment.find({ article: article._id, parentCommentId })
    .lean()
    .skip(skip)
    .limit(limit)
    .select("-article")
    .populate({
      path: "author",
      select: "avatar fullname username",
    })
    .sort({ createdAt: -1 });

  const result = await Promise.all(
    comments.map(async (comment) => {
      if (comment && comment.author && comment.author.avatar) {
        comment.author.avatar = addUrlToImg(comment.author.avatar);
      }
      const isAuthor =
        comment.author._id.toString() === article.author.toString();
      const replyCount = await Comment.countDocuments({
        parentCommentId: comment._id,
      });
      return me
        ? {
            ...comment,
            isMyComment: me._id.toString() === comment.author._id.toString(),
            isAuthor,
            replyCount,
          }
        : {
            ...comment,
            isAuthor,
            replyCount,
          };
    })
  );
  return result;
}

// -------------------- delete nested comments function -------------------- //

async function deleteCommentAndReplies(comment) {
  const replyComments = await Comment.find({
    parentCommentId: comment._id,
  });

  await Promise.all(
    replyComments.map(async (replyComment) => {
      await deleteCommentAndReplies(replyComment._id);

      await Comment.deleteOne({ _id: replyComment._id });
    })
  );
}

module.exports = {
  addComment,
  updateComment,
  deleteComment,
  getMainComments,
  getNestedComments,
};
