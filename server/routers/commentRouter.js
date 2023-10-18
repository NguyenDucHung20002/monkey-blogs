const express = require("express");
const fetchMe = require("../middlewares/fetchMe");
const requiredAuth = require("../middlewares/requiredAuth");
const optionalAuth = require("../middlewares/optionalAuth");
const commentController = require("../controllers/commentController");

const router = express.Router();

// add comment
router.post("/:slug", requiredAuth, fetchMe, commentController.addComment);

// update comment
router.put("/:id", requiredAuth, fetchMe, commentController.updateComment);

// delete comment
router.delete("/:id", requiredAuth, fetchMe, commentController.deleteComment);

// get main comments
router.get("/:slug", optionalAuth, fetchMe, commentController.getMainComments);

// get nested comments
router.get(
  "/:slug/:id/replies",
  optionalAuth,
  fetchMe,
  commentController.getNestedComments
);

module.exports = router;
