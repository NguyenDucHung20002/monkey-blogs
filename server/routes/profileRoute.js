import express from "express";
import optionalAuth from "../middlewares/optionalAuth.js";
import profileController from "../controllers/profileController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import mongoUpload from "../middlewares/mongoUpload.js";
import validator from "../middlewares/validator.js";
import profileSchema from "../validations/profileSchema.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkBanned from "../middlewares/checkBanned.js";

const router = express.Router();

router.get(
  "/:username",
  optionalAuth,
  fetchMe,
  checkBanned,
  profileController.getProfile
);

router.patch(
  "/me/update",
  requiredAuth,
  fetchMe,
  checkBanned,
  validator(profileSchema.updateProfileSchema, "body"),
  mongoUpload.single("avatar"),
  profileController.updateMyProfile
);

export default router;
