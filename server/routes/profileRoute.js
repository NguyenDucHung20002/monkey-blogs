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
import mongoUpdoad from "../middlewares/mongoUpload.js";
import checkUploadedAvatar from "../middlewares/checkUploadedAvatar.js";

const router = express.Router();

router.patch(
  "/me/update",
  requiredAuth,
  fetchMe,
  mongoUpdoad.single("avatar"),
  checkUploadedAvatar,
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
