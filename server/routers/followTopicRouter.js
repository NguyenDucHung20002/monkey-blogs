const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const followTopicController = require("../controllers/followTopicController");

const router = express.Router();

router.post(
  "/follow-unfollow/:slug",
  jwtAuth,
  followTopicController.followOrUnfollowATopic
);

module.exports = router;
