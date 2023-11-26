import express from "express";
import blockController from "../controllers/blockController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  blockController.blockAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  blockController.unBlockAProfile
);

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  checkBanned,
  blockController.getBlockedProfiles
);

export default router;
