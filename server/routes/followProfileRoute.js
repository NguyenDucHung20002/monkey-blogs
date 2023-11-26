import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import followProfileController from "../controllers/followProfileController.js";
import fetchMyUser from "../middlewares/fetchMyUser.js";
import checkBanned from "../middlewares/checkBanned.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  followProfileController.followAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  followProfileController.unFollowAProfile
);

router.get(
  "/:username/following",
  optionalAuth,
  fetchMyUser,
  checkBanned,
  followProfileController.getFolloweds
);

router.get(
  "/:username/follower",
  optionalAuth,
  fetchMyUser,
  checkBanned,
  followProfileController.getFollowers
);

export default router;
