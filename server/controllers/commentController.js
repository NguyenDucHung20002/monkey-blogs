// import Comment from "../models/mysql/Comment.js";
// import Article from "../models/mysql/Article.js";
// import addUrlToImg from "../utils/addUrlToImg.js";
// import asyncMiddleware from "../middlewares/asyncMiddleware.js";
// import ErrorResponse from "../responses/ErrorResponse.js";
// import Profile from "../models/mysql/Profile.js";

// // ==================== add comment ==================== //
// const createComment = asyncMiddleware(async (req, res, next) => {
//   const me = req.me;
//   const { id } = req.params;
//   const { parentCommentId, content } = req.body;

//   const article = await Article.findById(id);

//   if (!article) throw ErrorResponse(404, "Article not found");

//   let newCommentData = {
//     articleId: article.id,
//     authorId: me.ProfileInfo.id,
//     content,
//   };

//   if (parentCommentId) {
//     const parentComment = await Comment.findByPk(parentCommentId);
//     if (!parentComment) throw ErrorResponse(404, "Comment not found");

//     newCommentData = {
//       ...newCommentData,
//       parentCommentId,
//       depth: parentComment.depth + 1,
//     };
//   }

//   const newComment = await Promise.all([
//     Comment.create(newCommentData),
//     article.increment({ commentsCount: 1 }),
//   ]);

//   //   const resultComment = await Comment.findByPk(newComment.id, {
//   //     include: { model: Profile, as: "author" },
//   //   });

//   //   resultComment.author.avatar = addUrlToImg(resultComment.author.avatar);

//   //   const isMyComment = myProfile.id === resultComment.author.id;

//   res.status(201).json({
//     success: true,
//     data: { ...resultComment.toJSON(), isMyComment },
//   });
// });

// // // ==================== update comment ==================== //
// // const updateComment = asyncMiddleware(async (req, res, next) => {
// //   const { id: myUserId } = req.payload;
// //   const { id } = req.params;
// //   const { content } = req.body;

// //   const myProfile = await Profile.findOne({ where: { userId: myUserId } });

// //   if (!myProfile) throw ErrorResponse(404, "Profile not found");

// //   const comment = await Comment.findOne({
// //     where: { id, authorId: myProfile.id },
// //   });

// //   if (!comment) throw ErrorResponse(404, "Comment not found");

// //   await comment.update({ content });

// //   res.json({ success: true, message: "Comment updated successfully" });
// // });

// // // ==================== delete comment ==================== //
// // const deleteComment = asyncMiddleware(async (req, res, next) => {
// //   const { id: myUserId } = req.payload;
// //   const { id } = req.params;

// //   const myProfile = await Profile.findOne({ where: { userId: myUserId } });

// //   if (!myProfile) throw ErrorResponse(404, "Profile not found");

// //   const deleteCommentAndReplies = async (comment) => {
// //     const replyComments = await Comment.find({
// //       where: { parentCommentId: comment.id },
// //     });

// //     await Promise.all(
// //       replyComments.map(async (replyComment) => {
// //         await deleteCommentAndReplies(replyComment._id);
// //         await Comment.destroy({ where: { id: replyComment.id } });
// //       })
// //     );
// //   };

// //   const comment = await Comment.findOne({
// //     where: { id, authorId: myProfile.id },
// //   });

// //   if (comment) {
// //     await Promise.all([
// //       deleteCommentAndReplies(comment),
// //       comment.destroy(),
// //       Article.update(
// //         { commentsCount: commentsCount - 1 },
// //         { where: { id: comment.articleId } }
// //       ),
// //     ]);
// //   }

// //   res.status(200).json({
// //     success: true,
// //     message: "Comment deleted successfully",
// //   });
// // });

// // // ==================== get article main comments ==================== //
// // const getMainComments = asyncMiddleware(async (req, res, next) => {
// //   const { id: myUserId } = req.payload;
// //   const { slug } = req.params;
// //   const { skip = 0, limit = 15 } = req.query;

// //   const article = await Article.findOne({ where: { slug } });

// //   if (!article) throw ErrorResponse(404, "Article not found");

// //   const commentsDoc = await Comment.findAll({
// //     where: {
// //       article: article.id,
// //       depth: 1,
// //       id: { [Op.gt]: skip },
// //       include: { model: Profile, as: "author" },
// //     },
// //     limit,
// //   });

// //   let comments = commentsDoc.map((commentDoc) => {
// //     commentDoc.author.avatar = addUrlToImg(commentDoc.author.avatar);
// //     return { commentDoc };
// //   });

// //   if (myUserId) {
// //     const myProfile = await Profile.findOne({ where: { userId: myUserId } });
// //     if (myProfile) {
// //       comments = await Promise.all([
// //         comments.map(async (comment) => {
// //           const isAuthor = comment.author.id === article.authorId;
// //           const isMyComment = myProfile.id === comment.author.id;
// //           return { ...comment.toJSON(), isAuthor, isMyComment };
// //         }),
// //       ]);
// //     }
// //   }

// //   const skipID = comments.length > 0 ? comments[comments.length - 1]._id : null;

// //   res.json({ success: true, data: comments, skipID });
// // });

// // // ==================== get article nested comments of main comment ==================== //
// // const getNestedComments = asyncMiddleware(async (req, res, next) => {
// //   const { id: myUserId } = req.payload;
// //   const { slug, commentId } = req.params;
// //   const { skip = 0, limit = 15 } = req.query;

// //   const article = await Article.findOne({ where: { slug } });

// //   if (!article) throw ErrorResponse(404, "Article not found");

// //   const parentComment = await Comment.findById(commentId);

// //   if (!parentComment) throw ErrorResponse(404, "Comment not found");

// //   const commentsDoc = await Comment.findAll({
// //     where: {
// //       parentCommentId: parentComment.id,
// //       id: { [Op.gt]: skip },
// //       include: { model: Profile, as: "author" },
// //     },
// //     limit,
// //   });

// //   let replyComments = commentsDoc.map((commentDoc) => {
// //     commentDoc.author.avatar = addUrlToImg(commentDoc.author.avatar);
// //     return { commentDoc };
// //   });

// //   if (myUserId) {
// //     const myProfile = await Profile.findOne({ where: { userId: myUserId } });
// //     if (myProfile) {
// //       replyComments = replyComments.map((replyComment) => {
// //         const isAuthor = replyComment.author.id === article.authorId;
// //         const isMyComment = myProfile.id === replyComment.author.id;
// //         return { ...replyComment.toJSON(), isAuthor, isMyComment };
// //       });
// //     }
// //   }

// //   const skipID =
// //     commentsDoc.length > 0 ? commentsDoc[commentsDoc.length - 1]._id : null;

// //   res.json({ success: true, data: replyComments, skipID });
// // });

// export default {
//   createComment,
// };
