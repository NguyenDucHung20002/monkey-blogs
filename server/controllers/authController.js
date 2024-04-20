import ErrorResponse from "../responses/ErrorResponse.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import User from "../models/mysql/User.js";
import hashPassword from "../utils/hashPassword.js";
import emailService from "../services/nodeMailer.js";
import randomBytes from "../utils/randomBytes.js";
import env from "../config/env.js";
import VerifyToken from "../models/mongodb/VerifyToken.js";
import SetupPasswordToken from "../models/mongodb/SetupPasswordToken.js";
import Profile from "../models/mysql/Profile.js";
import bcrypt from "bcryptjs";
import generateUserName from "../utils/generateUserName.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import ms from "ms";
import jwt from "jsonwebtoken";
import generateAccessToken from "../utils/generateAccessToken.js";
import RefreshToken from "../models/mongodb/RefreshToken.js";

// ==================== register ==================== //

const register = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ where: { email } });

  if (user) throw ErrorResponse(409, "Email already exists");

  const token = randomBytes(32);

  const hashedPassword = hashPassword(password);

  const link = `${env.CLIENT_DOMAIN}/verify-email?token=${token}`;

  user = await User.create({
    username: generateUserName(email),
    email,
    password: hashedPassword,
  });

  await Promise.all([
    emailService({
      to: email,
      subject: "Complete Your Sign Up",
      template: "verify-email",
      context: { email: user.email, link },
    }),
    Profile.create({ userId: user.id }),
    VerifyToken.create({ email, token }),
  ]);

  res.status(201).json({
    success: true,
    message: "Check your email to verify your account",
  });
});

// ==================== forgot password ==================== //

const forgotPassword = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) throw ErrorResponse(404, "User not found");

  const token = randomBytes(32);

  const verifyToken = await VerifyToken.findOne({ email });

  const operation = verifyToken
    ? verifyToken.updateOne({ token })
    : VerifyToken.create({ email, token });

  const link = `${env.CLIENT_DOMAIN}/verify-forgot-password?token=${token}`;

  await Promise.all([
    emailService({
      to: email,
      subject: "Reset Your Password",
      template: "forgot-password",
      context: { email: user.email, link },
    }),
    operation,
  ]);

  res.json({
    success: true,
    message: "Check your email to reset your password",
  });
});

// ==================== verify email ==================== //

const verifyEmail = asyncMiddleware(async (req, res, next) => {
  const { token } = req.body;

  const tokenToVerify = await VerifyToken.findOne({ token });

  if (!tokenToVerify) throw ErrorResponse(404, "Invalid or expired link");

  await Promise.all([
    tokenToVerify.deleteOne(),
    User.update(
      { isVerified: true },
      { where: { email: tokenToVerify.email } }
    ),
  ]);

  res.json({
    success: true,
    message: "Email verified successfully",
  });
});

// ==================== verify setup password ==================== //

const verifySetUpPassword = asyncMiddleware(async (req, res, next) => {
  const { token } = req.body;

  const tokenToVerify = await SetupPasswordToken.findOne({ token });

  if (!tokenToVerify) throw ErrorResponse(404, "Invalid or expired link");

  await Promise.all([
    User.update(
      { password: tokenToVerify.password },
      { where: { email: tokenToVerify.email } }
    ),
    tokenToVerify.deleteOne(),
  ]);

  res.json({
    success: true,
    message: "Setup password successfully",
  });
});

// ==================== reset password ==================== //

const resetPassword = asyncMiddleware(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  const tokenToVerify = await VerifyToken.findOne({ token });

  if (!tokenToVerify) throw ErrorResponse(404, "Invalid or expired link");

  if (newPassword !== confirmPassword) {
    throw ErrorResponse(400, "Confirm password do not match");
  }

  const hashedPassword = hashPassword(newPassword);

  await Promise.all([
    User.update(
      { password: hashedPassword },
      { where: { email: tokenToVerify.email } }
    ),
    tokenToVerify.deleteOne(),
  ]);

  res.json({
    success: true,
    message: "Password reset successfully",
  });
});

// ==================== login with email and password ==================== //

const loginWithEmailAndPassword = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
    include: { model: Profile, as: "profileInfo" },
  });

  if (!user || !user.password) {
    throw ErrorResponse(401, "Email or password is wrong");
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) throw ErrorResponse(401, "Email or password is wrong");

  if (!user.isVerified) {
    const token = randomBytes(32);

    const link = `${env.CLIENT_DOMAIN}/verify-email?token=${token}`;

    const verifyToken = await VerifyToken.findOne({ email });

    const operation = verifyToken
      ? verifyToken.updateOne({ token })
      : VerifyToken.create({ email, token });

    await Promise.all([
      operation,
      emailService({
        to: email,
        subject: "Complete Your Sign Up",
        template: "verify-email",
        context: { email: user.email, link },
      }),
    ]);

    return res.json({
      success: true,
      message: "Check your email to verify your account",
    });
  }

  const refreshToken = await generateRefreshToken({ id: user.id });

  const accessToken = jwt.sign({ id: user.id }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRE_TIME,
  });

  res.clearCookie("refresh_token");

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: ms(env.JWT_REFRESH_EXPIRE_TIME),
  });

  res.json({
    success: true,
    hasProfile: Boolean(user.profileInfo.fullname && user.profileInfo.avatar),
    access_token: accessToken,
  });
});

// ==================== get access token ==================== //

const getAccessToken = asyncMiddleware(async (req, res, next) => {
  const refreshToken = req.cookies["refresh_token"];

  const accessToken = await generateAccessToken(refreshToken);
  if (!accessToken) {
    throw ErrorResponse(401, "Invalid refresh token");
  }

  res.json({
    success: true,
    access_token: accessToken,
  });
});

// ==================== login with google ==================== //

const loginWithGoogle = asyncMiddleware(async (req, res, next) => {
  const { avatar, fullname, email } = req.user;

  let user = await User.findOne({
    where: { email },
    include: {
      model: Profile,
      as: "profileInfo",
    },
  });

  let operation;

  if (!user) {
    const username = generateUserName(email);
    user = await User.create({ email, username, isVerified: true });
  }

  if (!user.isVerified) {
    operation = user.update({ isVerified: true });
  }

  if (!user.profileInfo) {
    operation = Profile.create({ avatar, fullname, userId: user.id });
  }

  if (
    user.profileInfo &&
    (!user.profileInfo.avatar || !user.profileInfo.fullname)
  ) {
    operation = user.profileInfo.update({ avatar, fullname, userId: user.id });
  }

  await operation;

  const refreshToken = await generateRefreshToken({ id: user.id });

  const accessToken = jwt.sign({ id: user.id }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRE_TIME,
  });

  res.clearCookie("refresh_token");

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: ms(env.JWT_REFRESH_EXPIRE_TIME),
  });

  res.redirect(`${env.CLIENT_DOMAIN}?token=${accessToken}`);
});

// ==================== logout ==================== //

const logout = asyncMiddleware(async (req, res, next) => {
  const refreshToken = req.cookies["refresh_token"];

  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

  await RefreshToken.deleteOne({
    userId: payload.id,
    iat: payload.iat,
    exp: payload.exp,
  });

  res.clearCookie("refresh_token");

  res.json({
    success: true,
    message: "Successfully logout",
  });
});

export default {
  register,
  forgotPassword,
  verifyEmail,
  verifySetUpPassword,
  resetPassword,
  loginWithGoogle,
  loginWithEmailAndPassword,
  logout,
  getAccessToken,
};
