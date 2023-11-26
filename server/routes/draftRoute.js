import express from "express";
import draftController from "../controllers/draftController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

router.post(
  "/",
  requiredAuth,
  fetchMe,
  checkBanned,
  draftController.createADraft
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  draftController.updateADraft
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  draftController.deleteADraft
);

router.get(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  draftController.getADraft
);

router.get(
  "/me/all",
  requiredAuth,
  fetchMe,
  checkBanned,
  draftController.getMyDrafts
);

export default router;
