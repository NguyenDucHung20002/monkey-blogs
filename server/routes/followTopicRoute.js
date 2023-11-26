import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import followTopicController from "../controllers/followTopicController.js";
import fetchMyUser from "../middlewares/fetchMyUser.js";
import checkBanned from "../middlewares/checkBanned.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  followTopicController.followATopic
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  followTopicController.unFollowATopic
);

router.get(
  "/me/topics",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  followTopicController.getMyFollowingTopics
);

export default router;
