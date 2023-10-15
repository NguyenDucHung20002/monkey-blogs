const express = require("express");
const requiredAuth = require("../middlewares/requiredAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const likeController = require("../controllers/likeController");

const router = express.Router();

// like an article
router.post(
  "/:slug/like-unlike",
  requiredAuth,
  fetchMyProfile,
  likeController.likeOrUnLikeAnArticle
);

module.exports = router;
