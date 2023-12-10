import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Block from "../models/mysql/Block.js";
import Mute from "../models/mysql/Mute.js";
import Follow_Profile from "../models/mysql/Follow_Profile.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import fileController from "./fileController.js";

// ==================== get profile ==================== //
const getProfile = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const me = req.me ? req.me : null;

  if (me && me.id === user.id) {
    user.profileInfo = {
      ...user.profileInfo.toJSON(),
      username: user.username,
      role: user.role.slug,
      isMyProfile: true,
    };
  }

  if (me && me.id !== user.id) {
    const [isBlocked, isMuted, isFollowed] = await Promise.all([
      Block.findOne({
        where: { blockedId: user.profileInfo.id, blockerId: me.profileInfo.id },
      }),
      Mute.findOne({
        where: { mutedId: user.profileInfo.id, muterId: me.profileInfo.id },
      }),
      Follow_Profile.findOne({
        where: {
          followedId: user.profileInfo.id,
          followerId: me.profileInfo.id,
        },
      }),
    ]);

    user.profileInfo = {
      ...user.profileInfo.toJSON(),
      username: user.username,
      role: user.role.slug,
      isMyProfile: false,
      isMuted: Boolean(isMuted),
      isBlocked: Boolean(isBlocked),
      isFollowed: Boolean(isFollowed),
    };
  }

  res.json({ success: true, data: user.profileInfo });
});

// ==================== update my profile ==================== //
const updateMyProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { fullname, bio, about, avatar } = req.body;

  if (avatar !== me.profileInfo.avatar) {
    const oldAvatar = me.profileInfo.avatar.split("/");
    fileController.autoRemoveImg(oldAvatar[oldAvatar.length - 1]);
  }

  await me.profileInfo.update({ fullname, bio, about, avatar });

  res.json({ success: true, message: "Profile updated successfully" });
});

export default { getProfile, updateMyProfile };
