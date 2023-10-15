const express = require("express");
const validator = require("../middlewares/validator");
const userSchema = require("../validations/userSchema");
const mongoUpload = require("../middlewares/mongoUpload");
const requiredAuth = require("../middlewares/requiredAuth");
const optionalAuth = require("../middlewares/optionalAuth");
const userController = require("../controllers/userController");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const fetchUserProfile = require("../middlewares/fetchUserProfile");

const router = express.Router();

// get user profile
router.get(
  "/:username",
  optionalAuth,
  fetchMyProfile,
  fetchUserProfile,
  userController.getProfile
);

// get user following
router.get(
  "/:username/following",
  optionalAuth,
  fetchMyProfile,
  fetchUserProfile,
  userController.getFollowing
);

// get user followers
router.get(
  "/:username/followers",
  optionalAuth,
  fetchMyProfile,
  fetchUserProfile,
  userController.getFollowers
);

// get user articles
router.get(
  "/:username/articles",
  fetchUserProfile,
  userController.getUserArticles
);

// get my following topics
router.get(
  "/me/following/topics",
  requiredAuth,
  fetchMyProfile,
  userController.getMyFollowingTopics
);

// update my profile
router.put(
  "/me/update",
  requiredAuth,
  fetchMyProfile,
  mongoUpload.single("avatar"),
  validator(userSchema.updateSchema),
  userController.updateMyProfile
);

// get random users suggestions
router.get(
  "/me/suggestions",
  requiredAuth,
  fetchMyProfile,
  userController.getRandomUsers
);

// search users
router.post("/search", optionalAuth, fetchMyProfile, userController.searchUser);

module.exports = router;
