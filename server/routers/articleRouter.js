const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const validator = require("../middlewares/validator");
const mongoUpload = require("../middlewares/mongoUpload");
const articleSchema = require("../validations/articleSchema");
const fetchProfile = require("../middlewares/fetchProfile");
const articleController = require("../controllers/articleController");

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  fetchProfile,
  mongoUpload.single("img"),
  validator(articleSchema.createSchema),
  articleController.createAnArticle
);

router.put(
  "/:slug",
  jwtAuth,
  fetchProfile,
  mongoUpload.single("img"),
  validator(articleSchema.updateSchema),
  articleController.updateMyArticle
);

router.delete(
  "/:slug",
  jwtAuth,
  fetchProfile,
  articleController.deleteMyArticle
);

router.get("/:slug", articleController.getAnArticle);

router.get("", articleController.getAllArticles);

module.exports = router;
