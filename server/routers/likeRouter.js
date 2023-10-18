const express = require("express");
const fetchMe = require("../middlewares/fetchMe");
const requiredAuth = require("../middlewares/requiredAuth");
const likeController = require("../controllers/likeController");

const router = express.Router();

// like an article
router.post(
  "/:slug/like-unlike",
  requiredAuth,
  fetchMe,
  likeController.likeOrUnLikeAnArticle
);

module.exports = router;
