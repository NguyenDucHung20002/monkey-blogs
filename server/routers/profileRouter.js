const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const validator = require("../middlewares/validator");
const mongoUpload = require("../middlewares/mongoUpload");
const profileSchema = require("../validations/profileSchema");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/", jwtAuth, profileController.getMyProfile);

router.put(
  "/",
  jwtAuth,
  mongoUpload.single("avatar"),
  validator(profileSchema.updateSchema),
  profileController.updateMyProfile
);

router.get("/followers", jwtAuth, profileController.getMyFollowers);

router.get("/following", jwtAuth, profileController.getMyFollowing);

router.get(
  "/following/topics",
  jwtAuth,
  profileController.getMyFollowingTopics
);

router.get("/:username", profileController.getAUserProfile);

router.get("/:username/followers", profileController.getUserFollowers);

router.get("/:username/following", profileController.getUserFollowing);

module.exports = router;
