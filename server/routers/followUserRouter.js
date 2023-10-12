const express = require("express");
const requiredAuth = require("../middlewares/requiredAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const fetchUserProfile = require("../middlewares/fetchUserProfile");
const followUserController = require("../controllers/followUserController");

const router = express.Router();

router.post(
  "/:username/follow-unfollow",
  requiredAuth,
  fetchMyProfile,
  fetchUserProfile,
  followUserController.followOrUnfollowAUser
);

module.exports = router;
