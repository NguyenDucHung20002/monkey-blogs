const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Token = require("../models/Token");
const { env } = require("../config/env");
const requiredAuth = require("../middlewares/requiredAuth");
const fetchMyProfile = require("../middlewares/fetchMyProfile");
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

    let tokenDoc = await Token.findOne({ userId: user });
    if (!tokenDoc) {
      tokenDoc = new Token({
        userId: user,
        token,
        timestamps: Date.now(),
      });
    } else {
      tokenDoc.token = token;
      tokenDoc.timestamps = Date.now();
    }

    await tokenDoc.save();

    res.redirect(`${env.CLIENT_HOST}:${env.CLIENT_PORT}?token=${token}`);
  }
);

// Login
router.post("/login", requiredAuth, fetchMyProfile, authController.login);

// Logout
router.post("/logout", requiredAuth, fetchMyProfile, authController.logout);

module.exports = router;
