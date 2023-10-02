const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const validator = require("../middlewares/validator");
const mongoUpload = require("../middlewares/mongoUpload");
const articleSchema = require("../validations/articleSchema");
const articleController = require("../controllers/articleController");

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  mongoUpload.single("img"),
  validator(articleSchema.createSchema),
  articleController.createAnArticle
);

router.put(
  "/:slug",
  jwtAuth,
  mongoUpload.single("img"),
  validator(articleSchema.updateSchema),
  articleController.updateMyArticle
);

router.delete("/:slug", jwtAuth, articleController.deleteMyArticle);

router.get("/:slug", articleController.getAnArticle);

module.exports = router;
