import express from "express";
import userController from "../controllers/userController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import fetchMe from "../middlewares/fetchMe.js";
import validator from "../middlewares/validator.js";
import userSchema from "../validations/userSchema.js";
import fetchUser from "../middlewares/fetchUser.js";

const router = express.Router();

router.patch(
  "/me/change-password",
  requiredAuth,
  validator(userSchema.changePasswordSchema),
  userController.changePassword
);

router.get(
  "/",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  userController.getAllUsers
);

router.patch(
  "/ban/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  fetchUser,
  validator(userSchema.banAUserSchema),
  userController.banAUser
);

router.patch(
  "/unban/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  fetchUser,
  userController.unBanAUser
);

router.patch(
  "/update-ban/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  fetchUser,
  userController.updateUserBan
);

export default router;
