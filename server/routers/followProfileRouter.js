const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const fetchUserProfile = require("../middlewares/fetchUserProfile");
const followProfileController = require("../controllers/followProfileController");

const router = express.Router();

router.post(
  "/follow-unfollow/:username",
  jwtAuth,
  fetchMyProfile,
  fetchUserProfile,
  followProfileController.followOrUnfollowAUser
);

module.exports = router;
