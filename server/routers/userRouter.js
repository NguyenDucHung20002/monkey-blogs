const express = require("express");
const fetchMe = require("../middlewares/fetchMe");
const fetchUser = require("../middlewares/fetchUser");
const validator = require("../middlewares/validator");
const userSchema = require("../validations/userSchema");
const mongoUpload = require("../middlewares/mongoUpload");
const requiredAuth = require("../middlewares/requiredAuth");
const optionalAuth = require("../middlewares/optionalAuth");
const userController = require("../controllers/userController");

const router = express.Router();

// get profile
router.get(
  "/:username",
  optionalAuth,
  fetchMe,
  fetchUser,
  userController.getProfile
);

// count following
router.get(
  "/:username/following/amount",
  fetchUser,
  userController.countFollowing
);

// count followers
router.get(
  "/:username/followers/amount",
  fetchUser,
  userController.countFollowers
);

// get following
router.get(
  "/:username/following",
  optionalAuth,
  fetchMe,
  fetchUser,
  userController.getFollowing
);

// get followers
router.get(
  "/:username/followers",
  optionalAuth,
  fetchMe,
  fetchUser,
  userController.getFollowers
);

// get user articles
router.get("/:username/articles", fetchUser, userController.getUserArticles);

// get followed topics
router.get(
  "/me/following/topics",
  requiredAuth,
  fetchMe,
  userController.getMyFollowingTopics
);

// update my profile
router.put(
  "/me/update",
  requiredAuth,
  fetchMe,
  mongoUpload.single("avatar"),
  validator(userSchema.updateSchema),
  userController.updateMyProfile
);

// get random users suggestions
router.get(
  "/me/suggestions",
  requiredAuth,
  fetchMe,
  userController.getRandomUsers
);

// search users
router.post("/search", optionalAuth, fetchMe, userController.searchUser);

module.exports = router;
