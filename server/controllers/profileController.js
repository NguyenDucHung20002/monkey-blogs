import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Block from "../models/mysql/Block.js";
import Mute from "../models/mysql/Mute.js";
import Follow_Profile from "../models/mysql/Follow_Profile.js";

// ==================== get profile ==================== //
const getProfile = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const me = req.me ? req.me : null;

  if (me && me.id === user.id) {
    user.profileInfo = { ...user.profileInfo.toJSON(), isMyProfile: true };
  }

  if (me && me.id !== user.id) {
    const [isBlocked, isMuted, isFollowed] = await Promise.all([
      Block.findOne({
        where: { blockedId: user.profileInfo.id, blockerId: me.profileInfo.id },
        attributes: ["id"],
      }),
      Mute.findOne({
        where: { mutedId: user.profileInfo.id, muterId: me.profileInfo.id },
        attributes: ["id"],
      }),
      Follow_Profile.findOne({
        where: {
          followedId: user.profileInfo.id,
          followerId: me.profileInfo.id,
        },
        attributes: ["id"],
      }),
    ]);

    user.profileInfo = {
      ...user.profileInfo.toJSON(),
      isMuted: !!isMuted,
      isBlocked: !!isBlocked,
      isFollowed: !!isFollowed,
    };
  }

  res.json({ success: true, data: user.profileInfo });
});

// ==================== update my profile ==================== //
const updateMyProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { fullname, bio, about } = req.body;

  await me.profileInfo.update({ fullname, bio, about });

  res.json({ success: true, message: "Profile updated successfully" });
});

export default { getProfile, updateMyProfile };
