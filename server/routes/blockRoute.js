import express from "express";
import blockController from "../controllers/blockController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import fetchMe from "../middlewares/fetchMe.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockByUser from "../middlewares/checkBlockedByUser.js";

const router = express.Router();

// -------------------- get blocked profiles -------------------- //

router.get("/me", requiredAuth, fetchMe, blockController.getBlockedProfiles);

// -------------------- block a user -------------------- //

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockByUser,
  blockController.blockAUser
);

// -------------------- unblock a user -------------------- //

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  blockController.unBlockAUser
);

export default router;
