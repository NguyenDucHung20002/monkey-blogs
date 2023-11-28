import express from "express";
import muteController from "../controllers/muteController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import fetchMe from "../middlewares/fetchMe.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockedByUser from "../middlewares/checBlockedByUser.js";

const router = express.Router();

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  muteController.muteAProfile
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  muteController.unMuteAProfile
);

router.get("/me/all", requiredAuth, fetchMe, muteController.getMutedProfiles);

export default router;
