const Comment = require("../models/Comment");
const Article = require("../models/Article");
const addUrlToImg = require("../utils/addUrlToImg");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== add comment ==================== //

const addComment = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const { myProfile } = req;
  const { parentCommentId, content } = req.body;

  const article = await Article.findOne({ slug });
  if (!article) {
    throw new ErrorResponse(404, "Article not found");
  }

  const data = {
    article: article._id,
    author: myProfile._id,
    content,
  };

  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new ErrorResponse(404, "Comment not found");
    }
    data.parentCommentId = parentComment._id;
    data.replyToUser = parentComment.author;
  }

  const comment = new Comment(data);

  await comment.save();

  res.status(201).json({
    success: true,
  });
});

// ==================== get article main comments ==================== //

const getMainComments = asyncMiddleware(async (req, res, next) => {
  const { slug } = req.params;
  const { myProfile } = req;

  const article = await Article.findOne({ slug });
  if (!article) {
    throw new ErrorResponse(404, "Article not found");
  }

  const comments = await commentList(
    myProfile,
    { article: article._id, parentCommentId: null },
    article
  );

  res.status(200).json({
    success: true,
    data: comments,
  });
});

// ==================== get article comment child comments of main comment ==================== //

const getChildComments = asyncMiddleware(async (req, res, next) => {
  const { slug, parentCommentId } = req.params;
  const { myProfile } = req;

  const article = await Article.findOne({ slug });
  if (!article) {
    throw new ErrorResponse(404, "Article not found");
  }

  const parentComment = await Comment.findById(parentCommentId);
  if (!parentComment) {
    throw new ErrorResponse(404, "Comment not found");
  }

  const childComments = await commentList(
    myProfile,
    { parentCommentId: parentComment._id },
    article
  );

  res.status(200).json({
    success: true,
    data: childComments,
  });
});

// -------------------- comment list function -------------------- //

async function commentList(myProfile, query, article) {
  const comments = await Comment.find(query)
    .populate({
      path: "author",
      select: "avatar fullname username",
    })
    .populate({
      path: "replyToUser",
      select: "fullname username",
    })
    .sort({ createdAt: -1 });

  const result = await Promise.all(
    comments.map(async (comment) => {
      const commentData = { ...comment.toObject() };
      if (commentData && commentData.author.avatar) {
        commentData.author.avatar = addUrlToImg(commentData.author.avatar);
      }
      const isAuthor =
        commentData.author._id.toString() == article.author.toString();
      const replyCount = await Comment.countDocuments({
        parentCommentId: comment._id,
      });
      return myProfile
        ? {
            ...commentData,
            isMyComment:
              myProfile._id.toString() === commentData.author._id.toString(),
            isAuthor,
            replyCount,
          }
        : {
            ...commentData,
            isAuthor,
            replyCount,
          };
    })
  );
  return result;
}

module.exports = {
  addComment,
  getMainComments,
  getChildComments,
};
