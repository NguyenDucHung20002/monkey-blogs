import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import followTopicController from "../controllers/followTopicController.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  followTopicController.getMyFollowedTopics
);

router.post("/:id", requiredAuth, fetchMe, followTopicController.followATopic);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  followTopicController.unFollowATopic
);

export default router;
