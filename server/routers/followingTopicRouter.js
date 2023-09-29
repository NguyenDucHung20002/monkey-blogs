const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const followingTopicController = require("../controllers/followingTopicController");

const router = express.Router();

router.post(
  "/follow-unfollow/:slug",
  jwtAuth,
  followingTopicController.followOrUnfollowATopic
);

module.exports = router;
