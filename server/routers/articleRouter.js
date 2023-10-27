const express = require("express");
const fetchMe = require("../middlewares/fetchMe");
const validator = require("../middlewares/validator");
const mongoUpload = require("../middlewares/mongoUpload");
const requiredAuth = require("../middlewares/requiredAuth");
const optionalAuth = require("../middlewares/optionalAuth");
const articleSchema = require("../validations/articleSchema");
const articleController = require("../controllers/articleController");

const router = express.Router();

// create article
router.post(
  "/",
  requiredAuth,
  fetchMe,
  mongoUpload.single("img"),
  validator(articleSchema.createSchema),
  articleController.createAnArticle
);

// update article
router.put(
  "/:slug",
  requiredAuth,
  fetchMe,
  mongoUpload.single("img"),
  validator(articleSchema.updateSchema),
  articleController.updateMyArticle
);

// delete article
router.delete(
  "/:slug",
  requiredAuth,
  fetchMe,
  articleController.deleteMyArticle
);

// get an article
router.get("/:slug", optionalAuth, fetchMe, articleController.getAnArticle);

// count article likes
router.get("/:slug/likes/amount", articleController.countArticleLikes);

// count article comment
router.get("/:slug/comments/amount", articleController.countArticleComments);

// get all articles
router.get("/", articleController.getAllArticles);

// get followed topic articles
router.get("/followed/topic/:tag", articleController.getFollwedTopicArticles);

// get followed authors articles
router.get(
  "/followed/authors",
  requiredAuth,
  fetchMe,
  articleController.getFollwedAuthorsArticles
);

// search topic
router.post(
  "/topics",
  validator(articleSchema.searchSchema),
  articleController.searchTopics
);

// search articles
router.post(
  "/search",
  validator(articleSchema.searchSchema),
  articleController.searchArticles
);

module.exports = router;
