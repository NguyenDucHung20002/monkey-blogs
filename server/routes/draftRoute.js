import express from "express";
import draftController from "../controllers/draftController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchMe from "../middlewares/fetchMe.js";
import validator from "../middlewares/validator.js";
import draftSchema from "../validations/draftSchema.js";

const router = express.Router();

router.post(
  "/",
  requiredAuth,
  fetchMe,
  checkBanned,
  validator(draftSchema.createDraftSchema, "body"),
  draftController.createADraft
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  checkBanned,
  validator(draftSchema.updateDraftSchema, "body"),
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
