const express = require("express");
const fetchMe = require("../middlewares/fetchMe");
const validatior = require("../middlewares/validator");
const requiredAuth = require("../middlewares/requiredAuth");
const optionalAuth = require("../middlewares/optionalAuth");
const commentSchema = require("../validations/commentSchema");
const commentController = require("../controllers/commentController");

const router = express.Router();

// add comment
router.post(
  "/:slug",
  requiredAuth,
  fetchMe,
  validatior(commentSchema.createSchema),
  commentController.addComment
);

// update comment
router.put(
  "/:id",
  requiredAuth,
  fetchMe,
  validatior(commentSchema.idSchema, "params"),
  validatior(commentSchema.updateSchema),
  commentController.updateComment
);

// delete comment
router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  validatior(commentSchema.idSchema, "params"),
  commentController.deleteComment
);

// get main comments
router.get("/:slug", optionalAuth, fetchMe, commentController.getMainComments);

// get nested comments
router.get(
  "/:slug/:id/replies",
  optionalAuth,
  fetchMe,
  validatior(commentSchema.idSchema, "params"),
  commentController.getNestedComments
);

module.exports = router;
