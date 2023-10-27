const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Token = require("../models/Token");
const { env } = require("../config/env");
const fetchMe = require("../middlewares/fetchMe");
const requiredAuth = require("../middlewares/requiredAuth");
const authController = require("../controllers/authController");

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
    const { id: user } = req.user;

    const token = jwt.sign({ id: user }, env.SECRET_KEY);

    await Token.create({ userId: user, token });

    res.redirect(`${env.CLIENT_HOST}:${env.CLIENT_PORT}?token=${token}`);
  }
);

// Login
router.post("/login", requiredAuth, fetchMe, authController.login);

// Logout
router.delete("/logout", requiredAuth, fetchMe, authController.logout);

module.exports = router;
