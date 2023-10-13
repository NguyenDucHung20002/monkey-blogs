const express = require("express");
const requiredAuth = require("../middlewares/requiredAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const followTopicController = require("../controllers/followTopicController");

const router = express.Router();

router.post(
  "/follow-unfollow/:slug",
  requiredAuth,
  fetchMyProfile,
  followTopicController.followOrUnfollowATopic
);

module.exports = router;
