import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Block from "../models/mysql/Block.js";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import addUrlToImg from "../utils/addUrlToImg.js";

// ==================== block a user ==================== //

const blockAUser = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;

  if (user.profileInfo.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Cannot block your self");
  }

  if (user.role.slug === "admin" || user.role.slug === "staff") {
    throw ErrorResponse(400, `Cannot block ${user.role.name}`);
  }

  const blocks = await Block.findOne({
    where: { blockedId: user.profileInfo.id, blockerId: me.profileInfo.id },
  });

  if (!blocks) {
    await Block.create(
      { blockedId: user.profileInfo.id, blockerId: me.profileInfo.id },
      { me: me, user: user }
    );
  }

  res.status(201).json({
    success: true,
    message: `${user.profileInfo.fullname} has been blocked`,
  });
});

// ==================== unblock a user ==================== //

const unBlockAUser = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;

  if (user.profileInfo.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Cannot unblock your self");
  }

  const blocks = await Block.findOne({
    where: { blockedId: user.profileInfo.id, blockerId: me.profileInfo.id },
  });

  if (blocks) await blocks.destroy();

  res.json({
    success: true,
    message: `${user.profileInfo.fullname} has been unblocked`,
  });
});

// ==================== get blocked profiles ==================== //

const getBlockedProfiles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { blockerId: me.profileInfo.id };

  if (skip) whereQuery.createdAt = { [Op.lt]: skip };

  const blockedProfiles = await Block.findAll({
    where: whereQuery,
    attributes: ["id", "createdAt"],
    include: {
      model: Profile,
      as: "blocked",
      attributes: ["id", "fullname", "avatar", "bio"],
      include: { model: User, as: "userInfo", attributes: ["username"] },
    },
    order: [["createdAt", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const result = blockedProfiles.map((blockedProfile) => {
    blockedProfile.blocked.avatar = addUrlToImg(blockedProfile.blocked.avatar);

    return blockedProfile.blocked;
  });

  const newSkip =
    blockedProfiles.length > 0
      ? blockedProfiles[blockedProfiles.length - 1].createdAt
      : null;

  res.json({
    success: true,
    data: result,
    newSkip,
  });
});

export default {
  blockAUser,
  unBlockAUser,
  getBlockedProfiles,
};
