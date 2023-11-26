import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Profile from "../models/mysql/Profile.js";

// ==================== ban a user ==================== //
const banAUser = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { banType } = req.body;

  const user = await User.findByPk(id, {
    attributes: ["id", "bannedsCount", "status"],
    include: { model: Profile, as: "profileInfo", attributes: ["fullname"] },
  });

  if (!user) throw ErrorResponse(404, "User not found");

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
    bannedsCount: user.bannedsCount + 1,
  });

  res.status(201).json({
    success: true,
    message: `${user.profileInfo.fullname} has been banned`,
  });
});

// ==================== update user ban ==================== //
const updateUserBan = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { banType } = req.body;

  const user = await User.findByPk(id, {
    attributes: ["id", "bannedsCount", "status"],
    include: { model: Profile, as: "profileInfo", attributes: ["fullname"] },
  });

  if (!user) throw ErrorResponse(404, "User not found");

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
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: ["id", "bannedsCount"],
    include: { model: Profile, as: "profileInfo", attributes: ["fullname"] },
  });

  if (!user) throw ErrorResponse(404, "User not found");

  await user.update({
    status: "normal",
    banType: null,
    bannedUntil: null,
    bannedBy: null,
    bannedsCount: user.bannedsCount - 1,
  });

  res.json({
    success: true,
    message: `${user.profileInfo.fullname} has been unbanned`,
  });
});

// ==================== get all users ==================== //
const getAllUsers = asyncMiddleware(async (req, res, next) => {
  const { skip = 0, limit = 15, search } = req.query;

  let whereQuery = { id: { [Op.gt]: skip }, roleId: 1 };

  if (search) {
    whereQuery[Op.or] = [
      { username: { [Op.substring]: search } },
      { email: { [Op.substring]: search } },
    ];
  }

  let users = await User.findAll({
    where: whereQuery,
    attributes: { exclude: ["roleId", "bannedById"] },
    include: { model: User, as: "bannedBy", attributes: ["username"] },
    limit: Number(limit) && Number.isInteger(limit) ? limit : 15,
    order: [["reportsCount", "DESC"]],
  });

  users = users.map((user) => {
    return {
      id: user.id,
      username: user.username,
      reportsCount: user.reportsCount,
      bannedsCount: user.bannedsCount,
      banType: user.banType,
      bannedUntil: user.bannedUntil,
      status: user.status,
      bannedBy: user.bannedBy ? user.bannedBy.username : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });

  const newSkip = users.length > 0 ? users[users.length - 1].id : null;

  res.json({ success: true, data: users, newSkip });
});

export default { banAUser, unBanAUser, updateUserBan, getAllUsers };
