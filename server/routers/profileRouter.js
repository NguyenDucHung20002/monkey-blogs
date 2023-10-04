const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const validator = require("../middlewares/validator");
const mongoUpload = require("../middlewares/mongoUpload");
const profileSchema = require("../validations/profileSchema");
const fetchProfile = require("../middlewares/fetchProfile");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/", jwtAuth, fetchProfile, profileController.getProfile);

router.put(
  "/",
  jwtAuth,
  mongoUpload.single("avatar"),
  fetchProfile,
  validator(profileSchema.updateSchema),
  profileController.updateProfile
);

router.get("/followers", jwtAuth, fetchProfile, profileController.getFollowers);

router.get("/following", jwtAuth, fetchProfile, profileController.getFollowing);

router.get(
  "/following/topics",
  jwtAuth,
  fetchProfile,
  profileController.getFollowingTopics
);

router.get("/:username", fetchProfile, profileController.getProfile);

router.get(
  "/:username/followers",
  fetchProfile,
  profileController.getFollowers
);

router.get(
  "/:username/following",
  fetchProfile,
  profileController.getFollowing
);

module.exports = router;
