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
import hashPassword from "../utils/hashPassword.js";
import emailService from "../services/nodeMailer.js";
import randomBytes from "../utils/randomBytes.js";
import RegisterToken from "../models/mongodb/RegisterToken.js";

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
      user = await User.create({ email, username, isVerified: true });
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

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user && user.email.includes("@gmail.com") && user.password === null) {
    return res.json({
      success: true,
      message:
        "Check your email to verify that you have requested to set up a password for your existi account",
    });
  }

  if (user && user.email.includes("@gmail.com") && user.password !== null) {
    return res.status(409).json({
      success: false,
      message: "Email already exists",
    });
  }

  const hashedPassword = hashPassword(password);

  const token = randomBytes(32);

  const link = `${env.CLIENT_HOST}:${env.CLIENT_PORT}/verify?${token}`;

  await Promise.all([
    emailService({
      to: email,
      subject: "Verify your email",
      html: `<h3>Click <a href="${link}">here</a> to verify your email</h3>`,
    }),
    User.create({
      username: `@${email.split("@")[0]}`,
      email,
      password: hashedPassword,
    }),
    RegisterToken.create({ email, token }),
  ]);

  res.status(201).json({
    success: true,
    message: "Created account successfully",
  });
});

router.post("/login", requiredAuth, fetchMe, authController.login);

router.delete("/logout", requiredAuth, authController.logout);

export default router;
