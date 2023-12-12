import express from "express";
import passport from "passport";
import requiredAuth from "../middlewares/requiredAuth.js";
import authController from "../controllers/authController.js";
import fetchMe from "../middlewares/fetchMe.js";

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

router.post("/register", authController.register);

router.patch("/verify-email", authController.verifyEmail);

router.patch("/verify-setup-password", authController.verifySetUpPassword);

router.patch("/reset-password/:token", authController.resetPassword);

router.post("/login-email", authController.loginEmail);

router.post("/login-google", requiredAuth, fetchMe, authController.loginGoogle);

router.delete("/logout", requiredAuth, authController.logout);

export default router;
