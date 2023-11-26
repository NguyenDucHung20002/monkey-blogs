import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import followTopicController from "../controllers/followTopicController.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkBanned from "../middlewares/checkBanned.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  followTopicController.followATopic
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  followTopicController.unFollowATopic
);

router.get(
  "/me/all",
  requiredAuth,
  fetchMe,
  checkBanned,
  followTopicController.getMyFollowedTopics
);

export default router;
