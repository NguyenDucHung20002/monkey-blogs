import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Mute from "../models/mysql/Mute.js";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import Role from "../models/mysql/Role.js";

// ==================== mute a user ==================== //

const muteAUser = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;

  if (user.profileInfo.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Cannot mute your own profile");
  }

  if (user.role.slug === "admin" || user.role.slug === "staff") {
    throw ErrorResponse(400, `Cannot mute ${user.role.name}`);
  }

  const mutes = await Mute.findOne({
    where: { mutedId: user.profileInfo.id, muterId: me.profileInfo.id },
  });

  if (!mutes) {
    await Mute.create({
      mutedId: user.profileInfo.id,
      muterId: me.profileInfo.id,
    });
  }

  res.status(201).json({
    success: true,
    message: `${user.profileInfo.fullname} has been muted`,
  });
});

// ==================== unmute a user ==================== //

const unMuteAUser = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;

  if (user.profileInfo.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Bad Request: Cannot unmute your own profile");
  }

  const mutes = await Mute.findOne({
    where: { mutedId: user.profileInfo.id, muterId: me.profileInfo.id },
  });

  if (mutes) await mutes.destroy();

  res.json({
    success: true,
    message: `${user.profileInfo.fullname} has been unmuted`,
  });
});

// ==================== get muted profiles ==================== //
const getMutedProfiles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { muterId: me.profileInfo.id };

  if (skip) whereQuery.createdAt = { [Op.lt]: skip };

  const mutedProfiles = await Mute.findAll({
    where: whereQuery,
    attributes: ["id", "createdAt"],
    include: {
      model: Profile,
      as: "muted",
      attributes: ["id", "fullname", "avatar", "bio"],
      include: {
        model: User,
        as: "userInfo",
        attributes: ["username"],
        include: { model: Role, as: "role", attributes: ["slug"] },
      },
    },
    order: [["createdAt", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const result = mutedProfiles.map((mutedProfile) => {
    mutedProfile.muted.avatar = addUrlToImg(mutedProfile.muted.avatar);
    return mutedProfile.muted;
  });

  const newSkip =
    mutedProfiles.length > 0
      ? mutedProfiles[mutedProfiles.length - 1].createdAt
      : null;

  res.json({
    success: true,
    data: result,
    newSkip,
  });
});

export default {
  muteAUser,
  unMuteAUser,
  getMutedProfiles,
};
