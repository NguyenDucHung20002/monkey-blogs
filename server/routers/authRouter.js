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
    const token = jwt.sign({ id: user._id }, env.SECRET_KEY);

    let tokenDoc = await Token.findOne({ userId: user._id });
    if (!tokenDoc) {
      tokenDoc = new Token({
        userId: user._id,
        token,
      });
    } else {
      tokenDoc.token = token;
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
