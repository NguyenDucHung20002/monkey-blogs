const express = require("express");
const requiredAuth = require("../middlewares/requiredAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const followTopicController = require("../controllers/followTopicController");

const router = express.Router();

// follow or unfollow a topic
router.post(
  "/:slug/follow-unfollow",
  requiredAuth,
  fetchMyProfile,
  followTopicController.followOrUnfollowATopic
);

module.exports = router;
