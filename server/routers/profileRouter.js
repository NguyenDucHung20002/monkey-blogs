const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const validator = require("../middlewares/validator");
const mongoUpload = require("../middlewares/mongoUpload");
const profileSchema = require("../validations/profileSchema");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const fetchUserProfile = require("../middlewares/fetchUserProfile");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/", jwtAuth, fetchMyProfile, profileController.getProfile);

router.put(
  "/",
  jwtAuth,
  fetchMyProfile,
  mongoUpload.single("avatar"),
  validator(profileSchema.updateSchema),
  profileController.updateProfile
);

router.get(
  "/followers",
  jwtAuth,
  fetchMyProfile,
  profileController.getFollowers
);

router.get(
  "/following",
  jwtAuth,
  fetchMyProfile,
  profileController.getFollowing
);

router.get(
  "/following/topics",
  jwtAuth,
  fetchMyProfile,
  profileController.getFollowingTopics
);

router.get("/:username", fetchUserProfile, profileController.getProfile);

router.get(
  "/:username/followers",
  fetchUserProfile,
  profileController.getFollowers
);

router.get(
  "/:username/following",
  fetchUserProfile,
  profileController.getFollowing
);

module.exports = router;
