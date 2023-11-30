import express from "express";
import topicController from "../controllers/topicController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import authorize from "../middlewares/authorize.js";
import validator from "../middlewares/validator.js";
import topicSchema from "../validations/topicSchema.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

router.post(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  validator(topicSchema.createTopicSchema, "body"),
  topicController.createTopic
);

router.get(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  topicController.getAllTopics
);

router.get(
  "/create-article",
  requiredAuth,
  fetchMe,
  topicController.searchTopicsCreateArticle
);

router.get("/explore-topics", topicController.exploreAllTopics);

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  validator(topicSchema.updateTopicSchema, "body"),
  topicController.updateTopic
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  topicController.deleteTopic
);

router.patch(
  "/:id/approve",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  topicController.martTopicAsApproved
);

router.get("/:slug", optionalAuth, fetchMe, topicController.getATopic);

export default router;