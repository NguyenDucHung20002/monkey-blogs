import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import followProfileController from "../controllers/followProfileController.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockedByUser from "../middlewares/checBlockedByUser.js";

const router = express.Router();

router.get(
  "/who-to-follow",
  requiredAuth,
  fetchMe,
  followProfileController.whoToFollow
);

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  followProfileController.followAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  followProfileController.unFollowAProfile
);

router.get(
  "/:username/following",
  optionalAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  followProfileController.getFolloweds
);

router.get(
  "/:username/followers",
  optionalAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  followProfileController.getFollowers
);

export default router;
