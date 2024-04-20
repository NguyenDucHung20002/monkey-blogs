import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import followProfileController from "../controllers/followProfileController.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockedByUser from "../middlewares/checkBlockedByUser.js";

const router = express.Router();

// -------------------- who to follow -------------------- //

router.get(
  "/who-to-follow",
  requiredAuth,
  fetchMe,
  followProfileController.whoToFollow
);

// -------------------- follow a user -------------------- //

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  followProfileController.followAUser
);

// -------------------- unfollow a user -------------------- //

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  followProfileController.unFollowAUser
);

// -------------------- get followed profiles -------------------- //

router.get(
  "/:username/following",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  followProfileController.getFollowedProfiles
);

// -------------------- get follower profiles -------------------- //

router.get(
  "/:username/followers",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  followProfileController.getFollowerProfiles
);

export default router;
