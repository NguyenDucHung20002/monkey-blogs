import express from "express";
import blockController from "../controllers/blockController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import fetchMe from "../middlewares/fetchMe.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockByUser from "../middlewares/checBlockedByUser.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockByUser,
  blockController.blockAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  blockController.unBlockAProfile
);

router.get(
  "/me/all",
  requiredAuth,
  fetchMe,
  blockController.getBlockedProfiles
);

export default router;
