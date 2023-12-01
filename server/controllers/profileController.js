import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Block from "../models/mysql/Block.js";
import Mute from "../models/mysql/Mute.js";
import Follow_Profile from "../models/mysql/Follow_Profile.js";
import ErrorResponse from "../responses/ErrorResponse.js";

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
  const result = req.checkResult;
  const { fullname, bio, about } = req.body;

  const filename = req.file?.filename;
  const size = req.file?.size;

  const FILE_LIMIT = 5 * 1024 * 1024;
  if (size && size > FILE_LIMIT) {
    throw new ErrorResponse(400, "File too large");
  }

  if (result[0].nsfw > 0.7) {
    throw ErrorResponse(400, "Avatar image contains 18+");
  }

  await me.profileInfo.update({ fullname, bio, about, avatar: filename });

  res.json({ success: true, message: "Profile updated successfully" });
});

export default { getProfile, updateMyProfile };
