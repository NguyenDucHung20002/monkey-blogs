import express from "express";
import draftController from "../controllers/draftController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMyUser from "../middlewares/fetchMyUser.js";

const router = express.Router();

router.post(
  "/",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  draftController.createADraft
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  draftController.updateADraft
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  draftController.deleteADraft
);

router.get(
  "/:id",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  draftController.getADraft
);

router.get(
  "/me/all",
  requiredAuth,
  fetchMyUser,
  checkBanned,
  draftController.getMyDrafts
);

export default router;
