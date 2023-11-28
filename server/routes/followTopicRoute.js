import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import followTopicController from "../controllers/followTopicController.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

router.post("/:id", requiredAuth, fetchMe, followTopicController.followATopic);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  followTopicController.unFollowATopic
);

router.get(
  "/me/all",
  requiredAuth,
  fetchMe,
  followTopicController.getMyFollowedTopics
);

export default router;
