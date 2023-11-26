import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import Token from "../models/mongodb/Token.js";
import env from "../config/env.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authController from "../controllers/authController.js";
import User from "../models/mysql/User.js";
import Profile from "../models/mysql/Profile.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkBanned from "../middlewares/checkBanned.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const { fullname, avatar, email } = req.user;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      const username = `@${email.split("@")[0]}`;
      user = await User.create({ email, username });
      await Profile.create({ avatar, fullname, userId: user.id });
    }

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRE_TIME,
    });

    const { exp, iat } = jwt.verify(token, env.JWT_SECRET);

    await Token.create({ userId: user.id, token, iat, exp });

    res.redirect(`${env.CLIENT_HOST}:${env.CLIENT_PORT}?token=${token}`);
  }
);

router.post("/login", requiredAuth, fetchMe, checkBanned, authController.login);

router.delete("/logout", requiredAuth, fetchMe, authController.logout);

export default router;
