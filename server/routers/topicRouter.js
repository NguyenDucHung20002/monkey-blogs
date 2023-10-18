const express = require("express");
const validator = require("../middlewares/validator");
const topicSchema = require("../validations/topicSchema");
const { authorize } = require("../middlewares/authorize");
const requiredAuth = require("../middlewares/requiredAuth");
const optionalAuth = require("../middlewares/optionalAuth");
const fetchMe = require("../middlewares/fetchMe");
const topicController = require("../controllers/topicController");

const router = express.Router();

// create topic
router.post(
  "/",
  requiredAuth,
  authorize("admin"),
  validator(topicSchema.createSchema),
  topicController.createTopic
);

// update topic
router.put(
  "/:slug",
  requiredAuth,
  authorize("admin"),
  validator(topicSchema.updateSchema),
  topicController.updateTopic
);

// delete topic
router.delete(
  "/:slug",
  requiredAuth,
  authorize("admin"),
  topicController.deleteTopic
);

// get a topic
router.get("/:slug", optionalAuth, fetchMe, topicController.getATopic);

// get all topic
router.get("/", topicController.getAllTopics);

// get topic articles
router.get(
  "/tag/:slug/articles",
  optionalAuth,
  fetchMe,
  topicController.getTopicArticles
);

// get random topics suggestions
router.get(
  "/me/suggestions",
  requiredAuth,
  fetchMe,
  topicController.getRandomTopics
);

module.exports = router;
