import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Role from "../models/mysql/Role.js";
import hashPassword from "../utils/hashPassword.js";
import bcrypt from "bcryptjs";
import Profile from "../models/mysql/Profile.js";
import SetupPasswordToken from "../models/mongodb/SetupPasswordToken.js";
import randomBytes from "../utils/randomBytes.js";
import env from "../config/env.js";
import emailService from "../services/nodeMailer.js";

// ==================== ban a user ==================== //

const banAUser = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;
  const { banType } = req.body;

  if (user.status === "banned") {
    throw ErrorResponse(404, `${user.profileInfo.fullname} already banned`);
  }

  let bannedUntil = null;

  if (banType === "1week") {
    bannedUntil = new Date();
    bannedUntil.setDate(bannedUntil.getDate() + 7);
  }

  if (banType === "1month") {
    bannedUntil = new Date();
    bannedUntil.setMonth(bannedUntil.getMonth() + 1);
  }

  if (banType === "1year") {
    bannedUntil = new Date();
    bannedUntil.setFullYear(bannedUntil.getFullYear() + 1);
  }

  await user.update({
    status: "banned",
    banType,
    bannedUntil,
    bannedById: me.id,
    bansCount: user.bansCount + 1,
  });

  res.status(201).json({
    success: true,
    message: `${user.profileInfo.fullname} has been banned`,
  });
});

// ==================== update user ban ==================== //

const updateUserBan = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;
  const { banType } = req.body;

  if (user.status === "normal") {
    throw ErrorResponse(404, `${user.profileInfo.fullname} not banned`);
  }

  let bannedUntil = null;

  if (banType === "1week") {
    bannedUntil = new Date();
    bannedUntil.setDate(bannedUntil.getDate() + 7);
  }

  if (banType === "1month") {
    bannedUntil = new Date();
    bannedUntil.setMonth(bannedUntil.getMonth() + 1);
  }

  if (banType === "1year") {
    bannedUntil = new Date();
    bannedUntil.setFullYear(bannedUntil.getFullYear() + 1);
  }

  await user.update({
    status: "banned",
    banType,
    bannedUntil,
    bannedById: me.id,
  });

  res.json({
    success: true,
    message: `Update ${user.profileInfo.fullname} ban successfully`,
  });
});

// ==================== unban a user ==================== //

const unBanAUser = asyncMiddleware(async (req, res, next) => {
  const user = req.user;

  await user.update({
    status: "normal",
    banType: null,
    bannedUntil: null,
    bannedById: null,
    bansCount: user.bansCount - 1,
  });

  res.json({
    success: true,
    message: `${user.profileInfo.fullname} has been unbanned`,
  });
});

// ==================== get all users ==================== //

const getAllUsers = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip = 0, limit = 15, search } = req.query;

  let whereQuery = {
    id: { [Op.and]: [{ [Op.gt]: skip }, { [Op.ne]: me.profileInfo.id }] },
    roleId: 1,
    isVerified: true,
  };

  if (search) {
    whereQuery[Op.or] = [
      { username: { [Op.substring]: search } },
      { email: { [Op.substring]: search } },
    ];
  }

  const users = await User.findAll({
    where: whereQuery,
    attributes: { exclude: ["roleId", "bannedById", "isVerified", "password"] },
    include: {
      model: User,
      as: "bannedBy",
      attributes: ["id", "email", "username"],
      include: {
        model: Profile,
        as: "profileInfo",
        attributes: [],
        where: { avatar: { [Op.ne]: null }, fullname: { [Op.ne]: null } },
      },
      include: { model: Role, as: "role", attributes: ["id", "name", "slug"] },
    },
    limit: Number(limit) ? Number(limit) : 15,
    order: [["reportsCount", "DESC"]],
  });

  const newSkip = users.length > 0 ? users[users.length - 1].id : null;

  res.json({ success: true, data: users, newSkip });
});

// ==================== change password ==================== //

const changePassword = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (me.password) {
    const isMatch = bcrypt.compareSync(oldPassword, me.password);

    if (!isMatch) throw ErrorResponse(401, "Old password is incorrect");
  }

  if (newPassword !== confirmPassword) {
    throw ErrorResponse(400, "Confirm password do not match");
  }

  const hashedPassword = hashPassword(newPassword);

  await me.update({ password: hashedPassword });

  res.json({ success: true, message: "Password changed successfully" });
});

// ==================== check has password or not ==================== //

const checkHasPassword = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  const hashPassword = me.password ? true : false;

  res.json({
    success: true,
    data: hashPassword,
  });
});

// ==================== check has password or not ==================== //

const setUpPassword = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { password } = req.body;

  if (me.password) {
    throw ErrorResponse(401, "You already have a password");
  }

  const token = randomBytes(32);

  const hashedPassword = hashPassword(password);

  const setupToken = await SetupPasswordToken.findOne({
    email: me.email,
  });

  const operation = setupToken
    ? setupToken.updateOne({ token })
    : SetupPasswordToken.create({
        email: me.email,
        token,
        password: hashedPassword,
      });

  const link = `${env.CLIENT_DOMAIN}/verify-setup-password?token=${token}`;

  await Promise.all([
    operation,
    emailService({
      to: me.email,
      subject: "Complete Your Password Setup",
      template: "password-setup",
      context: { email: me.email, link },
    }),
  ]);

  res.json({
    success: true,
    message: "Please check your email to verify your password setup request",
  });
});

export default {
  banAUser,
  unBanAUser,
  updateUserBan,
  getAllUsers,
  changePassword,
  checkHasPassword,
  setUpPassword,
};
