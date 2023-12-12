import express from "express";
import passport from "passport";
import requiredAuth from "../middlewares/requiredAuth.js";
import authController from "../controllers/authController.js";
import validator from "../middlewares/validator.js";
import authSchema from "../validations/authSchema.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.loginGoogle
);

router.post(
  "/register",
  validator(authSchema.registerSchema),
  authController.register
);

router.patch(
  "/verify-email",
  validator(authSchema.verifyTokenSchema),
  authController.verifyEmail
);

router.patch(
  "/verify-setup-password",
  validator(authSchema.verifyTokenSchema),
  authController.verifySetUpPassword
);

router.post(
  "/forgot-password",
  validator(authSchema.forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/login-email",
  validator(authSchema.loginSchema),
  authController.loginEmail
);

router.delete("/logout", requiredAuth, authController.logout);

router.patch(
  "/reset-password/:token",
  validator(authSchema.resetPasswordSchema),
  authController.resetPassword
);

export default router;
