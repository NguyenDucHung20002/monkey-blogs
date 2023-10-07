const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const likeController = require("../controllers/likeController");

const router = express.Router();

router.post(
  "/like-unlike/:slug",
  jwtAuth,
  fetchMyProfile,
  likeController.likeOrUnlikeAnArticle
);

module.exports = router;
