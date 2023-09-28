const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Token = require("../models/Token");
const { env } = require("../config/env");
const jwtAuth = require("../middlewares/jwtAuth");
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
    const user = req.user;
    const token = jwt.sign({ id: user._id }, env.SECRET_KEY);

    let tokenDoc = await Token.findOne({ userId: user._id });
    if (!tokenDoc) {
      tokenDoc = new Token({
        userId: user._id,
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
router.post("/login", jwtAuth, authController.login);

// Logout
router.post("/logout", jwtAuth, authController.logout);

module.exports = router;
