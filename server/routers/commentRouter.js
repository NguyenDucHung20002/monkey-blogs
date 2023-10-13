const express = require("express");
const optionalAuth = require("../middlewares/optionalAuth");
const requiredAuth = require("../middlewares/requiredAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const commentCountroller = require("../controllers/commentController");

const router = express.Router();

router.post(
  "/:slug",
  requiredAuth,
  fetchMyProfile,
  commentCountroller.addComment
);

router.get(
  "/:slug",
  optionalAuth,
  fetchMyProfile,
  commentCountroller.getMainComments
);

router.get(
  "/:slug/:parentCommentId",
  optionalAuth,
  fetchMyProfile,
  commentCountroller.getChildComments
);

module.exports = router;
