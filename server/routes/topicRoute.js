import express from "express";
import topicController from "../controllers/topicController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import authorize from "../middlewares/authorize.js";
import validator from "../middlewares/validator.js";
import topicSchema from "../validations/topicSchema.js";
import fetchMyUser from "../middlewares/fetchMyUser.js";

const router = express.Router();

router.post(
  "/",
  requiredAuth,
  fetchMyUser,
  authorize("admin"),
  validator(topicSchema.createTopicSchema, "body"),
  topicController.createTopic
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMyUser,
  authorize("admin"),
  validator(topicSchema.updateTopicSchema, "body"),
  topicController.updateTopic
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMyUser,
  authorize("admin"),
  topicController.deleteTopic
);

// router.get("/:slug", optionalAuth, topicController.getATopic);

// router.get("/", topicController.getAllTopics);

export default router;
