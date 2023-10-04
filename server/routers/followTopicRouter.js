const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const fetchProfile = require("../middlewares/fetchProfile");
const followTopicController = require("../controllers/followTopicController");

const router = express.Router();

router.post(
  "/follow-unfollow/:slug",
  jwtAuth,
  fetchProfile,
  followTopicController.followOrUnfollowATopic
);

module.exports = router;
