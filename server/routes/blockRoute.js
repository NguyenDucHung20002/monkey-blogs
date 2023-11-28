import express from "express";
import blockController from "../controllers/blockController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMe from "../middlewares/fetchMe.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockByUser from "../middlewares/checBlockedByUser.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  fetchUser,
  checkBlockByUser,
  blockController.blockAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  fetchUser,
  blockController.unBlockAProfile
);

router.get(
  "/me/all",
  requiredAuth,
  fetchMe,
  checkBanned,
  blockController.getBlockedProfiles
);

export default router;
