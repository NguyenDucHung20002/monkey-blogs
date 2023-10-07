const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const followTopicController = require("../controllers/followTopicController");

const router = express.Router();

router.post(
  "/follow-unfollow/:slug",
  jwtAuth,
  fetchMyProfile,
  followTopicController.followOrUnfollowATopic
);

module.exports = router;
