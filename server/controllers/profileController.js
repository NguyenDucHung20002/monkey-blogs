import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Block from "../models/mysql/Block.js";
import Mute from "../models/mysql/Mute.js";
import Follow_Profile from "../models/mysql/Follow_Profile.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import fileController from "./fileController.js";
import User from "../models/mysql/User.js";
import Profile from "../models/mysql/Profile.js";

// ==================== get login information ==================== //

const getLoginInformation = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  res.json({
    success: true,
    data: {
      ...me.profileInfo.toJSON(),
      username: me.username,
      role: me.role.slug,
    },
  });
});

// ==================== setup profile ==================== //

const setupProfile = asyncMiddleware(async (req, res, next) => {
  const { id: myUserId } = req.jwtPayLoad;
  const { fullname } = req.body;

  const filename = req.file?.filename;

  const [user, profile] = await Promise.all([
    User.findByPk(myUserId),
    Profile.findOne({ where: { userId: myUserId } }),
  ]);

  if (!user) throw ErrorResponse(404, "User not found");

  if (profile && profile.fullname && profile.avatar) {
    throw ErrorResponse(409, "Profile already exists");
  }

  await Profile.update(
    { avatar: filename, fullname, userId: user.id },
    { where: { userId: user.id } }
  );

  res.json({
    success: true,
  });
});

// ==================== get profile ==================== //

const getProfile = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const me = req.me;

  if (me.id === user.id) {
    user.profileInfo = {
      ...user.profileInfo.toJSON(),
      username: user.username,
      role: user.role.slug,
      isMyProfile: true,
    };
  }

  if (me.id !== user.id) {
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

  res.json({
    success: true,
    data: user.profileInfo,
  });
});

// ==================== update profile ==================== //

const updateProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { fullname, bio, about } = req.body;

  const filename = req.file?.filename;

  if (filename && filename !== me.profileInfo.avatar) {
    const oldAvatar = me.profileInfo.avatar.split("/");
    await fileController.autoRemoveAnImage(oldAvatar[oldAvatar.length - 1]);
  }

  await me.profileInfo.update({ fullname, bio, about, avatar: filename });

  res.json({
    success: true,
    message: "Profile updated successfully",
  });
});

// ==================== update profile design ==================== //

const updateProfileDesign = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { design } = req.body;

  const operations = [];

  const myDesignObj = JSON.parse(me.profileInfo.profileDesign);
  const newDesignObj = JSON.parse(design);

  if (
    myDesignObj &&
    myDesignObj.image &&
    myDesignObj.image.filename &&
    newDesignObj.image.filename !== myDesignObj.image.filename
  ) {
    operations.push(
      fileController.autoRemoveAnImage(myDesignObj.image.filename),
      me.profileInfo.update({ profileDesign: design })
    );
  }

  operations.push(me.profileInfo.update({ profileDesign: design }));

  await Promise.all(operations);

  res.json({
    success: true,
    message: "Profile design updated successfully",
  });
});

export default {
  getProfile,
  setupProfile,
  updateProfile,
  getLoginInformation,
  updateProfileDesign,
};
