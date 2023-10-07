const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const validator = require("../middlewares/validator");
const mongoUpload = require("../middlewares/mongoUpload");
const articleSchema = require("../validations/articleSchema");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const articleController = require("../controllers/articleController");

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  fetchMyProfile,
  mongoUpload.single("img"),
  validator(articleSchema.createSchema),
  articleController.createAnArticle
);

router.put(
  "/:slug",
  jwtAuth,
  fetchMyProfile,
  mongoUpload.single("img"),
  validator(articleSchema.updateSchema),
  articleController.updateMyArticle
);

router.delete(
  "/:slug",
  jwtAuth,
  fetchMyProfile,
  articleController.deleteMyArticle
);

router.get("/:slug", articleController.getAnArticle);

router.get("/:slug/likes", articleController.getArticleLikes);

router.get("", articleController.getAllArticles);

module.exports = router;
