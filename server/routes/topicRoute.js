import express from "express";
import topicController from "../controllers/topicController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import authorize from "../middlewares/authorize.js";
import validator from "../middlewares/validator.js";
import topicSchema from "../validations/topicSchema.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkBanned from "../middlewares/checkBanned.js";

const router = express.Router();

router.post(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  validator(topicSchema.createTopicSchema, "body"),
  topicController.createTopic
);

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

router.get(
  "/:slug",
  optionalAuth,
  fetchMe,
  checkBanned,
  topicController.getATopic
);

router.get("/", optionalAuth, fetchMe, topicController.getAllTopics);

export default router;