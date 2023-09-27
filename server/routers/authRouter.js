const express = require("express");
const { env } = require("../config/env");
const passport = require("passport");
const jwt = require("jsonwebtoken");
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
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, env.SECRET_KEY, {
      expiresIn: env.EXPIRED_IN,
    });
    res.redirect(`${env.CLIENT_HOST}:${env.CLIENT_PORT}?token=${token}`);
  }
);

router.get("/login-success", jwtAuth, authController.loginSuccess);

module.exports = router;
