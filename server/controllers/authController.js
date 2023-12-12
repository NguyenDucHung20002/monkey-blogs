import Token from "../models/mongodb/JsonWebToken.js";
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
import generateJwt from "../utils/generateJwt.js";

// ==================== register ==================== //
const register = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user && user.password) throw ErrorResponse(409, "Email already exists");

  const token = randomBytes(32);

  const hashedPassword = hashPassword(password);

  if (user && user.email.includes("@gmail.com") && !user.password) {
    const link = `${env.CLIENT_HOST}:${env.CLIENT_PORT}/verify-setup-password?token=${token}`;

    const setupToken = await SetupPasswordToken.findOne({ where: { email } });

    const operation = setupToken
      ? setupToken.updateOne({ token })
      : setupToken.create({ email, token, password: hashedPassword });

    await Promise.all([
      emailService({
        to: email,
        subject: "Setup password",
        html: `<h3>Click <a href="${link}">here</a> to verify your password setup request.</h3>`,
      }),
      operation,
    ]);

    return res.json({
      success: true,
      message: "Please check your email to verify your password setup request",
    });
  }

  const link = `${env.CLIENT_HOST}:${env.CLIENT_PORT}/verify-email?token=${token}`;

  await Promise.all([
    emailService({
      to: email,
      subject: "Verify email",
      html: `<h3>Click <a href="${link}">here</a> to verify your email.</h3>`,
    }),
    User.create({
      username: `@${email.split("@")[0]}`,
      email,
      password: hashedPassword,
    }),
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

  const link = `${env.CLIENT_HOST}:${env.CLIENT_PORT}/verify-forgot-password?token=${token}`;

  await Promise.all([
    emailService({
      to: email,
      subject: "Forgot password",
      html: `<h3>Click <a href="${link}">here</a> to reset your password.</h3>`,
    }),
    VerifyToken.create({ email, token }),
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

  if (!tokenToVerify) throw ErrorResponse(404, "Can not find token to verify");

  await Promise.all([
    User.update(
      { isVerified: true },
      { where: { email: tokenToVerify.email } }
    ),
    tokenToVerify.deleteOne(),
  ]);

  res.json({ success: true, message: "Email verified successfully" });
});

// ==================== verify setup password ==================== //
const verifySetUpPassword = asyncMiddleware(async (req, res, next) => {
  const { token } = req.body;

  const tokenToVerify = await SetupPasswordToken.findOne({ token });

  if (!tokenToVerify) throw ErrorResponse(404, "Can not find token to verify");

  await Promise.all([
    User.update(
      { password: tokenToVerify.password },
      { where: { email: tokenToVerify.email } }
    ),
    tokenToVerify.deleteOne(),
  ]);

  res.json({ success: true, message: "Setup password successfully" });
});

// ==================== reset password ==================== //
const resetPassword = asyncMiddleware(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  const tokenToVerify = await VerifyToken.findOne({ token });

  if (!tokenToVerify) throw ErrorResponse(400, "Invalid or expired token");

  if (newPassword !== confirmPassword) {
    throw ErrorResponse(400, "passwords do not match");
  }

  const hashedPassword = hashPassword(newPassword);

  await Promise.all([
    User.update(
      { password: hashedPassword },
      { where: { email: tokenToVerify.email } }
    ),
    tokenToVerify.deleteOne(),
  ]);

  res.json({ success: true, message: "Password reset successfully" });
});

// ==================== login with email and password ==================== //
const loginEmail = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) throw ErrorResponse(401, "Email or password is wrong");

  if (!user.isVerified) {
    const token = randomBytes(32);

    const link = `${env.CLIENT_HOST}:${env.CLIENT_PORT}/verify-email?token=${token}`;

    const verifyToken = await VerifyToken.findOne({ email });

    const operation = verifyToken
      ? verifyToken.updateOne({ token })
      : VerifyToken.create({ email, token });

    await Promise.all([
      emailService({
        to: email,
        subject: "Verify email",
        html: `<h3>Click <a href="${link}">here</a> to verify your email</h3>`,
      }),
      operation,
    ]);

    return res.json({
      success: true,
      message: "Check your email to verify your account",
    });
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) throw ErrorResponse(401, "Email or password is wrong");

  const [jsonWebToken, profile] = await Promise.all([
    generateJwt({ id: user.id }),
    Profile.findByPk(user.id),
  ]);

  if (!profile) {
    return res.redirect(
      `${env.CLIENT_HOST}:${env.CLIENT_PORT}/setup-profile?token=${jsonWebToken}`
    );
  }

  res.json({ success: true, token: jsonWebToken });
});

// ==================== login with google ==================== //
const loginGoogle = asyncMiddleware(async (req, res, next) => {
  const { avatar, fullname, email } = req.user;

  let user = await User.findOne({ where: { email } });

  if (!user) {
    const username = `@${email.split("@")[0]}`;
    user = await User.create({ email, username, isVerified: true });
    await Profile.create({ avatar, fullname, userId: user.id });
  }

  const jsonWebToken = await generateJwt({ id: user.id });

  res.redirect(`${env.CLIENT_HOST}:${env.CLIENT_PORT}?token=${jsonWebToken}`);
});

// ==================== logout ==================== //
const logout = asyncMiddleware(async (req, res, next) => {
  const { id: myUserId, iat, exp } = req.jwtPayLoad;

  const myProfile = await User.findByPk(myUserId, { attributes: ["id"] });

  if (!myProfile) throw ErrorResponse(404, "Profile not found");

  await Token.deleteOne({ userId: myProfile.id, iat, exp });

  res.json({ success: true, message: "Successfully logout" });
});

export default {
  register,
  forgotPassword,
  verifyEmail,
  verifySetUpPassword,
  resetPassword,
  loginGoogle,
  loginEmail,
  logout,
};

// // ==================== login with google ==================== //
// const loginGoogle = asyncMiddleware(async (req, res, next) => {
//   const me = req.me;

//   res.json({
//     success: true,
//     data: {
//       ...me.profileInfo.toJSON(),
//       username: me.username,
//       role: me.role.slug,
//     },
//   });
// });
