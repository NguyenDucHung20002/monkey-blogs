import express from "express";
import draftController from "../controllers/draftController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import validator from "../middlewares/validator.js";
import draftSchema from "../validations/draftSchema.js";

const router = express.Router();

router.post(
  "/",
  requiredAuth,
  fetchMe,
  validator(draftSchema.createDraftSchema, "body"),
  draftController.createADraft
);

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  validator(draftSchema.updateDraftSchema, "body"),
  draftController.updateADraft
);

router.delete("/:id", requiredAuth, fetchMe, draftController.deleteADraft);

router.get("/:id", requiredAuth, fetchMe, draftController.getADraft);

router.get("/me/all", requiredAuth, fetchMe, draftController.getMyDrafts);

export default router;
