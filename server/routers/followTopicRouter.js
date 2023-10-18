const express = require("express");
const requiredAuth = require("../middlewares/requiredAuth");
const fetchMe = require("../middlewares/fetchMe");
const followTopicController = require("../controllers/followTopicController");

const router = express.Router();

// follow or unfollow a topic
router.post(
  "/:slug/follow-unfollow",
  requiredAuth,
  fetchMe,
  followTopicController.followOrUnfollowATopic
);

module.exports = router;
