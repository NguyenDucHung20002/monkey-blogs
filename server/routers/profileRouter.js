const express = require("express");
const validator = require("../middlewares/validator");
const mongoUpload = require("../middlewares/mongoUpload");
const requiredAuth = require("../middlewares/requiredAuth");
const optionalAuth = require("../middlewares/optionalAuth");
const profileSchema = require("../validations/profileSchema");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const fetchUserProfile = require("../middlewares/fetchUserProfile");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get(
  "/:username",
  optionalAuth,
  fetchMyProfile,
  fetchUserProfile,
  profileController.getProfile
);

router.get(
  "/:username/following",
  optionalAuth,
  fetchMyProfile,
  fetchUserProfile,
  profileController.getFollowing
);

router.get(
  "/:username/followers",
  optionalAuth,
  fetchMyProfile,
  fetchUserProfile,
  profileController.getFollowers
);

router.get(
  "/me/following/topics",
  requiredAuth,
  fetchMyProfile,
  profileController.getMyFollowingTopics
);

router.put(
  "/me/update",
  requiredAuth,
  fetchMyProfile,
  mongoUpload.single("avatar"),
  validator(profileSchema.updateSchema),
  profileController.updateMyProfile
);

module.exports = router;
