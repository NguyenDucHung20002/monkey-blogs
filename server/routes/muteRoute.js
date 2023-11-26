import express from "express";
import muteController from "../controllers/muteController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMyUser from "../middlewares/fetchMyUser.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  muteController.muteAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  muteController.unMuteAProfile
);

router.get(
  "/me",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  muteController.getMutedProfiles
);

export default router;
