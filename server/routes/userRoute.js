import express from "express";
import userController from "../controllers/userController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import fetchMyUser from "../middlewares/fetchMyUser.js";
import validator from "../middlewares/validator.js";
import userSchema from "../validations/userSchema.js";

const router = express.Router();

router.patch(
  "/ban/:id",
  requiredAuth,
  fetchMyUser,
  authorize("staff", "admin"),
  validator(userSchema.banAUserSchema),
  userController.banAUser
);

router.patch(
  "/unban/:id",
  requiredAuth,
  fetchMyUser,
  authorize("staff", "admin"),
  userController.unBanAUser
);

router.patch(
  "/update/:id",
  requiredAuth,
  fetchMyUser,
  authorize("staff", "admin"),
  userController.updateUserBan
);

router.get(
  "/",
  requiredAuth,
  fetchMyUser,
  authorize("staff", "admin"),
  userController.getAllUsers
);

export default router;
