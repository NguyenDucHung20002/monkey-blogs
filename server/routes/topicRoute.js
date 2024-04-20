import express from "express";
import topicController from "../controllers/topicController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import validator from "../middlewares/validator.js";
import topicSchema from "../validations/topicSchema.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

// -------------------- create a topic -------------------- //

router.post(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  validator(topicSchema.createATopicSchema, "body"),
  topicController.createATopic
);

// -------------------- get all topics -------------------- //

router.get(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  topicController.getAllTopics
);

// -------------------- search for topics during create article -------------------- //

router.get(
  "/create-article",
  requiredAuth,
  fetchMe,
  topicController.searchTopicsCreateArticle
);

// -------------------- explore topics -------------------- //

router.get("/explore-topics", topicController.exploreAllTopics);

// -------------------- recommended topics -------------------- //

router.get(
  "/recommended-topics",
  requiredAuth,
  fetchMe,
  topicController.recommendedTopics
);

// -------------------- update a topic -------------------- //

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  validator(topicSchema.updateATopicSchema, "body"),
  topicController.updateATopic
);

// -------------------- delete a topic -------------------- //

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  topicController.deleteATopic
);

// -------------------- approve a topic -------------------- //

router.patch(
  "/:id/approve",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  topicController.approveATopic
);

// -------------------- reject a topic -------------------- //

router.patch(
  "/:id/reject",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  topicController.rejectATopic
);

// -------------------- get a topic -------------------- //

router.get("/:slug", requiredAuth, fetchMe, topicController.getATopic);

export default router;
