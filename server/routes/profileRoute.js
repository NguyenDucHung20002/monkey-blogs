import express from "express";
import optionalAuth from "../middlewares/optionalAuth.js";
import profileController from "../controllers/profileController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import validator from "../middlewares/validator.js";
import profileSchema from "../validations/profileSchema.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockedByUser from "../middlewares/checBlockedByUser.js";

const router = express.Router();

router.post("/setup-profile", requiredAuth, profileController.setupProfile);

router.patch(
  "/me/update",
  requiredAuth,
  fetchMe,
  validator(profileSchema.updateProfileSchema, "body"),
  profileController.updateMyProfile
);

router.get(
  "/:username",
  optionalAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  profileController.getProfile
);

export default router;
