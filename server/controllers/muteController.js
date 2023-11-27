import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Mute from "../models/mysql/Mute.js";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import addUrlToImg from "../utils/addUrlToImg.js";

// ==================== mute a profile ==================== //
const muteAProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const profile = await Profile.findByPk(id, {
    attributes: ["id", "fullname"],
    include: { model: User, as: "userInfo", where: { status: "normal" } },
  });

  if (!profile) throw ErrorResponse(404, "Profile not found");

  if (profile.id === me.profileInfo.id) {
    throw ErrorResponse(400, "You can not mute your own profile");
  }

  const mutes = await Mute.findOne({
    where: { mutedId: profile.id, muterId: me.profileInfo.id },
    attributes: ["id"],
  });

  if (!mutes) {
    await Mute.create({ mutedId: profile.id, muterId: me.profileInfo.id });
  }

  res.status(201).json({
    success: true,
    message: `${profile.fullname} has been muted`,
  });
});

// ==================== unmute a profile ==================== //
const unMuteAProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const profile = await Profile.findOne({
    where: { id },
    attributes: ["id", "fullname"],
    include: { model: User, as: "userInfo", where: { status: "normal" } },
  });

  if (!profile) throw ErrorResponse(404, "Profile not found");

  if (profile.id === me.profileInfo.id) {
    throw ErrorResponse(400, "You can not unmute your own profile");
  }

  const mutes = await Mute.findOne({
    where: { mutedId: profile.id, muterId: me.profileInfo.id },
    attributes: ["id"],
  });

  if (mutes) await mutes.destroy();

  res.json({
    success: true,
    message: `${profile.fullname} has been unmuted`,
  });
});

// ==================== get list of muted profiles ==================== //
const getMutedProfiles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip = 0, limit = 15 } = req.query;

  const mutedProfiles = await Mute.findAll({
    where: { muterId: me.profileInfo.id, id: { [Op.gt]: skip } },
    attributes: ["id"],
    include: {
      model: Profile,
      as: "muted",
      attributes: ["id", "fullname", "avatar", "bio"],
      include: { model: User, as: "userInfo", attributes: ["username"] },
    },
    limit: Number(limit) ? Number(limit) : 15,
  });

  const muteds = mutedProfiles.map((mutedProfile) => {
    return {
      id: mutedProfile.muted.id,
      fullname: mutedProfile.muted.fullname,
      avatar: addUrlToImg(mutedProfile.muted.avatar),
      bio: mutedProfile.muted.bio,
      username: mutedProfile.muted.userInfo.username,
    };
  });

  const newSkip =
    mutedProfiles.length > 0
      ? mutedProfiles[mutedProfiles.length - 1].id
      : null;

  res.json({ success: true, data: muteds, newSkip });
});

export default { muteAProfile, unMuteAProfile, getMutedProfiles };
