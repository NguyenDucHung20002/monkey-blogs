const express = require("express");
const { env } = require("../config/env");
const jwtAuth = require("../middlewares/jwtAuth");
const followProfileController = require("../controllers/followProfileController");

const router = express.Router();

router.post(
  "/follow-unfollow/:username",
  jwtAuth,
  followProfileController.followOrUnfollowAUser
);

module.exports = router;
