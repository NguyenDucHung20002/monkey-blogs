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

router.get(
  "/:username",
  optionalAuth,
  fetchMyProfile,
  fetchUserProfile,
  userController.getProfile
);

router.get(
  "/:username/following",
  optionalAuth,
  fetchMyProfile,
  fetchUserProfile,
  userController.getFollowing
);

router.get(
  "/:username/followers",
  optionalAuth,
  fetchMyProfile,
  fetchUserProfile,
  userController.getFollowers
);

router.get(
  "/:username/articles",
  fetchUserProfile,
  userController.getUserArticles
);

router.get(
  "/me/following/topics",
  requiredAuth,
  fetchMyProfile,
  userController.getMyFollowingTopics
);

router.put(
  "/me/update",
  requiredAuth,
  fetchMyProfile,
  mongoUpload.single("avatar"),
  validator(userSchema.updateSchema),
  userController.updateMyProfile
);

router.get(
  "/me/suggestions",
  requiredAuth,
  fetchMyProfile,
  userController.getRandomUsers
);

module.exports = router;
