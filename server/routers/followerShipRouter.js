const express = require("express");
const { env } = require("../config/env");
const jwtAuth = require("../middlewares/jwtAuth");
const followerShipController = require("../controllers/followerShipController");

const router = express.Router();

router.post(
  "/follow-unfollow/:username",
  jwtAuth,
  followerShipController.followOrUnfollowAUser
);

module.exports = router;
