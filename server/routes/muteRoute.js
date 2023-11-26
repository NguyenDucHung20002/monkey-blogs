import express from "express";
import muteController from "../controllers/muteController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  muteController.muteAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  muteController.unMuteAProfile
);

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  checkBanned,
  muteController.getMutedProfiles
);

export default router;
