import express from "express";
import optionalAuth from "../middlewares/optionalAuth.js";
import profileController from "../controllers/profileController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import validator from "../middlewares/validator.js";
import profileSchema from "../validations/profileSchema.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkBanned from "../middlewares/checkBanned.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockedByUser from "../middlewares/checBlockedByUser.js";

const router = express.Router();

router.get(
  "/:username",
  optionalAuth,
  fetchMe,
  checkBanned,
  fetchUser,
  checkBlockedByUser,
  profileController.getProfile
);

router.patch(
  "/me/update",
  requiredAuth,
  fetchMe,
  checkBanned,
  validator(profileSchema.updateProfileSchema, "body"),
  profileController.updateMyProfile
);

export default router;
