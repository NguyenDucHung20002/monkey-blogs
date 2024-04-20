import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import commentController from "../controllers/commentController.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import validator from "../middlewares/validator.js";
import commentSchema from "../validations/commentSchema.js";

const router = express.Router();

// -------------------- create a comment -------------------- //

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  validator(commentSchema.createACommentSchema),
  commentController.createAComment
);

// -------------------- update a comment -------------------- //

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  validator(commentSchema.updateACommentSchema),
  commentController.updateAComment
);

// -------------------- delete a comment -------------------- //

router.delete("/:id", requiredAuth, fetchMe, commentController.deleteAComment);

// -------------------- get main comments of an article -------------------- //

router.get(
  "/:id",
  requiredAuth,
  fetchMe,
  commentController.getMainCommentsOfAnArticle
);

// -------------------- get nested comments of a comment -------------------- //

router.get(
  "/:id/replies",
  requiredAuth,
  fetchMe,
  commentController.getNestedCommentsOfAComment
);

export default router;
