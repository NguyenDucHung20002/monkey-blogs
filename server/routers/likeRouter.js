const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const fetchProfile = require("../middlewares/fetchProfile");
const likeController = require("../controllers/likeController");

const router = express.Router();

router.post(
  "/like-unlike/:slug",
  jwtAuth,
  fetchProfile,
  likeController.likeOrUnlikeAnArticle
);

module.exports = router;
