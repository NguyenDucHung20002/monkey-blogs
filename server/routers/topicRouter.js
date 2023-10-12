const express = require("express");
const validator = require("../middlewares/validator");
const topicSchema = require("../validations/topicSchema");
const { authorize } = require("../middlewares/authorize");
const requiredAuth = require("../middlewares/requiredAuth");
const optionalAuth = require("../middlewares/optionalAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
const topicController = require("../controllers/topicController");

const router = express.Router();

router.post(
  "/",
  requiredAuth,
  authorize("admin"),
  validator(topicSchema.createSchema),
  topicController.createTopic
);

router.put(
  "/:slug",
  requiredAuth,
  authorize("admin"),
  validator(topicSchema.updateSchema),
  topicController.updateTopic
);

router.delete(
  "/:slug",
  requiredAuth,
  authorize("admin"),
  topicController.deleteTopic
);

router.get("/:slug", optionalAuth, fetchMyProfile, topicController.getATopic);

router.get("/", topicController.getAllTopics);

router.get(
  "/tag/:slug/articles",
  optionalAuth,
  fetchMyProfile,
  topicController.getTopicArticles
);

module.exports = router;
