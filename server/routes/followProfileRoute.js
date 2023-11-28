import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import followProfileController from "../controllers/followProfileController.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockedByUser from "../middlewares/checBlockedByUser.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  fetchUser,
  checkBlockedByUser,
  followProfileController.followAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  fetchUser,
  followProfileController.unFollowAProfile
);

router.get(
  "/:username/following",
  optionalAuth,
  fetchMe,
  checkBanned,
  fetchUser,
  checkBlockedByUser,
  followProfileController.getFolloweds
);

router.get(
  "/:username/followers",
  optionalAuth,
  fetchMe,
  checkBanned,
  fetchUser,
  checkBlockedByUser,
  followProfileController.getFollowers
);

export default router;
