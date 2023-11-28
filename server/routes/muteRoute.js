import express from "express";
import muteController from "../controllers/muteController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMe from "../middlewares/fetchMe.js";
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
  muteController.muteAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  fetchUser,
  muteController.unMuteAProfile
);

router.get(
  "/me/all",
  requiredAuth,
  fetchMe,
  checkBanned,
  muteController.getMutedProfiles
);

export default router;
