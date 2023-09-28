const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const validator = require("../middlewares/validator");
const mongoUpload = require("../middlewares/mongoUpload");
const profileSchema = require("../validations/profileSchema");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/:username", profileController.getAProfile);

router.put(
  "/:username",
  jwtAuth,
  mongoUpload.single("avatar"),
  validator(profileSchema.updateSchema),
  profileController.updateMyProfile
);

router.get("/:username/followers", jwtAuth, profileController.getMyFollowers);

router.get("/:username/following", jwtAuth, profileController.getMyFollowing);

module.exports = router;
