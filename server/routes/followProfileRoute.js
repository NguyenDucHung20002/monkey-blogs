import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import followProfileController from "../controllers/followProfileController.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkBanned from "../middlewares/checkBanned.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  followProfileController.followAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  followProfileController.unFollowAProfile
);

router.get(
  "/:username/following",
  optionalAuth,
  fetchMe,
  checkBanned,
  followProfileController.getFolloweds
);

router.get(
  "/:username/followers",
  optionalAuth,
  fetchMe,
  checkBanned,
  followProfileController.getFollowers
);

export default router;
