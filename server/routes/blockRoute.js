import express from "express";
import blockController from "../controllers/blockController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMyUser from "../middlewares/fetchMyUser.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  blockController.blockAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  blockController.unBlockAProfile
);

router.get(
  "/me",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  blockController.getBlockedProfiles
);

export default router;
