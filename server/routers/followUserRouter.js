const express = require("express");
const fetchMe = require("../middlewares/fetchMe");
const fetchUser = require("../middlewares/fetchUser");
const requiredAuth = require("../middlewares/requiredAuth");
const followUserController = require("../controllers/followUserController");

const router = express.Router();

// folow or unfollow a user
router.post(
  "/:username/follow-unfollow",
  requiredAuth,
  fetchMe,
  fetchUser,
  followUserController.followOrUnfollowUser
);

module.exports = router;
