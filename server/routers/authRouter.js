const express = require("express");
const { env } = require("../config/env");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtAuth = require("../middlewares/jwtAuth");
const authController = require("../controllers/authController");
const Token = require("../models/Token");

const router = express.Router();

// Google OAuth process
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback URL
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, env.SECRET_KEY, {
      expiresIn: env.EXPIRED_IN,
    });

    await Token.create({ userId: user._id, token });

    res.redirect(`${env.CLIENT_HOST}:${env.CLIENT_PORT}?token=${token}`);
  }
);

// Login
router.post("/login", jwtAuth, authController.login);

// Logout
router.post("/logout", jwtAuth, authController.logout);

module.exports = router;
