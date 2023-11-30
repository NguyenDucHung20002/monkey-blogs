import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import commentController from "../controllers/commentController.js";
import optinalAuth from "../middlewares/optionalAuth.js";
import validator from "../middlewares/validator.js";
import commentSchema from "../validations/commentSchema.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  validator(commentSchema.createCommentSchema),
  commentController.createComment
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  validator(commentSchema.updateCommentSchema),
  commentController.updateComment
);

router.delete("/:id", requiredAuth, fetchMe, commentController.deleteComment);

router.get("/:id", optinalAuth, fetchMe, commentController.getMainComments);

router.get(
  "/:id/replies",
  optinalAuth,
  fetchMe,
  commentController.getNestedComments
);

export default router;
