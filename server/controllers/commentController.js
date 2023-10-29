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

  const article = await Article.findOne({ slug }).lean().select("_id author");
  if (!article) throw new ErrorResponse(404, "Article not found");

  const data = { article: article._id, author: me._id, content };

  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId)
      .lean()
      .select("_id depth");
    if (!parentComment) throw new ErrorResponse(404, "Comment not found");

    data.parentCommentId = parentComment._id;
    data.depth = parentComment.depth + 1;
  }

  const comment = new Comment(data);

  await comment.save();

  const result = await Comment.findById(comment._id)
    .lean()
    .select("-article")
    .populate({ path: "author", select: "avatar fullname username" });

  result.author.avatar = addUrlToImg(result.author.avatar);

  res.status(201).json({ success: true, data: result });
});

// ==================== update comment ==================== //

const updateComment = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { id } = req.params;
  const { content } = req.body;

  await Comment.findOneAndUpdate({ _id: id, author: me._id }, { content });

  res.status(200).json({ success: true });
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

  res.status(200).json({ success: true });
});

// ==================== get article main comments ==================== //

const getMainComments = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { slug } = req.params;
  const { skip, limit = 15 } = req.query;

  const article = await Article.findOne({ slug }).lean().select("_id author");
  if (!article) throw new ErrorResponse(404, "Article not found");

  const query = { article: article._id, depth: 1 };
  if (skip) query._id = { $lt: skip };

  const comments = await Comment.find(query)
    .lean()
    .limit(limit)
    .select("-article")
    .populate({ path: "author", select: "avatar fullname username" })
    .sort({ createdAt: -1 });

  const result = await Promise.all(
    comments.map(async (val) => {
      val.author.avatar = addUrlToImg(val.author.avatar);
      const isAuthor = val.author._id.toString() === article.author.toString();
      const replyCount = await Comment.count({ parentCommentId: val._id });
      return me
        ? {
            ...val,
            isMyComment: me._id.toString() === val.author._id.toString(),
            isAuthor,
            replyCount,
          }
        : { ...val, isAuthor, replyCount };
    })
  );

  const skipID = comments.length > 0 ? comments[comments.length - 1]._id : null;

  res.status(200).json({ success: true, data: result, skipID });
});

// ==================== get article nested comments of main comment ==================== //

const getNestedComments = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { id, slug } = req.params;
  const { skip, limit = 15 } = req.query;

  const article = await Article.findOne({ slug }).lean().select("_id author");
  if (!article) throw new ErrorResponse(404, "Article not found");

  const parentComment = await Comment.findById(id).lean().select("_id");
  if (!parentComment) throw new ErrorResponse(404, "Comment not found");

  const query = { article: article._id, parentCommentId: parentComment._id };
  if (skip) query._id = { $lt: skip };

  const comments = await Comment.find(query)
    .lean()
    .limit(limit)
    .select("-article")
    .populate({ path: "author", select: "avatar fullname username" })
    .sort({ createdAt: -1 });

  const result = await Promise.all(
    comments.map(async (val) => {
      val.author.avatar = addUrlToImg(val.author.avatar);
      const isAuthor = val.author._id.toString() === article.author.toString();
      const replyCount = await Comment.count({ parentCommentId: val._id });
      return me
        ? {
            ...val,
            isMyComment: me._id.toString() === val.author._id.toString(),
            isAuthor,
            replyCount,
          }
        : { ...val, isAuthor, replyCount };
    })
  );

  const skipID = comments.length > 0 ? comments[comments.length - 1]._id : null;

  res.status(200).json({ success: true, data: result, skipID });
});

// -------------------- delete nested comments function -------------------- //

const deleteCommentAndReplies = async (comment) => {
  const replyComments = await Comment.find({ parentCommentId: comment._id });

  await Promise.all(
    replyComments.map(async (replyComment) => {
      await deleteCommentAndReplies(replyComment._id);
      await Comment.deleteOne({ _id: replyComment._id });
    })
  );
};

module.exports = {
  addComment,
  updateComment,
  deleteComment,
  getMainComments,
  getNestedComments,
};
