import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import Block from "../models/mysql/Block.js";
import Mute from "../models/mysql/Mute.js";

// ==================== get profile ==================== //
const getProfile = asyncMiddleware(async (req, res, next) => {
  const { username } = req.params;
  const myUser = req.user ? req.user : null;

  let user = await User.findOne({
    where: { username, status: "normal" },
    include: {
      model: Profile,
      as: "profileInfo",
      attributes: { exclude: ["userId"] },
    },
  });

  if (!user) throw ErrorResponse(404, "Profile not found");

  user.profileInfo.avatar = addUrlToImg(user.profileInfo.avatar);

  if (myUser && myUser.id === user.id) {
    user.profileInfo = { ...user.profileInfo.toJSON(), isMyProfile: true };
  } else if (myUser && myUser.id !== user.id) {
    const isBlockedByUser = !!(await Block.findOne({
      where: {
        blockedId: myUser.profileInfo.id,
        blockerId: user.profileInfo.id,
      },
      attributes: ["id"],
    }));

    if (isBlockedByUser) {
      return res.json({
        success: true,
        message: `You have been blocked by ${user.profileInfo.fullname}`,
      });
    }

    const [isBlocked, isMuted] = await Promise.all([
      Block.findOne({
        where: {
          blockedId: user.profileInfo.id,
          blockerId: myUser.profileInfo.id,
        },
        attributes: ["id"],
      }),
      Mute.findOne({
        where: {
          mutedId: user.profileInfo.id,
          muterId: myUser.profileInfo.id,
        },
        attributes: ["id"],
      }),
    ]);

    user.profileInfo = {
      ...user.profileInfo.toJSON(),
      isMuted: !!isMuted,
      isBlocked: !!isBlocked,
    };
  }

  res.json({ success: true, data: user.profileInfo });
});

// ==================== update my profile ==================== //
const updateMyProfile = asyncMiddleware(async (req, res, next) => {
  const myUser = req.user;
  const { fullname, bio, about } = req.body;

  const filename = req.file?.filename;

  const size = req.file?.size;

  const FILE_LIMIT = 5 * 1024 * 1024;

  if (size && size > FILE_LIMIT) {
    throw ErrorResponse(400, `File too large. Maximum allowed size is 5 mb`);
  }

  await Profile.update(
    { fullname, avatar: filename, bio, about },
    { where: { userId: myUser.id } }
  );

  res.json({ success: true, message: "Profile updated successfully" });
});

export default { getProfile, updateMyProfile };
