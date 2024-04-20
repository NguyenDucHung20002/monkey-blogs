import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import profileController from "../controllers/profileController.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import validator from "../middlewares/validator.js";
import profileSchema from "../validations/profileSchema.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockedByUser from "../middlewares/checkBlockedByUser.js";
import mongoUpload from "../middlewares/mongoUpload.js";
import checkAvatar from "../middlewares/checkAvatar.js";

const router = express.Router();

// -------------------- get login information -------------------- //

router.get(
  "/login-information",
  requiredAuth,
  fetchMe,
  profileController.getLoginInformation
);

// -------------------- setup profile -------------------- //

router.post(
  "/setup-profile",
  requiredAuth,
  mongoUpload.single("avatar"),
  checkAvatar,
  validator(profileSchema.setupProfileSchema),
  profileController.setupProfile
);

// -------------------- update profile -------------------- //

router.patch(
  "/me/update",
  requiredAuth,
  fetchMe,
  mongoUpload.single("avatar"),
  checkAvatar,
  validator(profileSchema.updateProfileSchema, "body"),
  profileController.updateProfile
);

// -------------------- get profile -------------------- //

router.get(
  "/:username",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  profileController.getProfile
);

// -------------------- update profile design -------------------- //

router.patch(
  "/me/update/design",
  requiredAuth,
  fetchMe,
  validator(profileSchema.updateProfileDesignSchema, "body"),
  profileController.updateProfileDesign
);

export default router;
