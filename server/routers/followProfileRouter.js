const express = require("express");
const requiredAuth = require("../middlewares/requiredAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const fetchUserProfile = require("../middlewares/fetchUserProfile");
const followProfileController = require("../controllers/followProfileController");

const router = express.Router();

router.post(
  "/follow-unfollow/:username",
  requiredAuth,
  fetchMyProfile,
  fetchUserProfile,
  followProfileController.followOrUnfollowAUser
);

module.exports = router;
