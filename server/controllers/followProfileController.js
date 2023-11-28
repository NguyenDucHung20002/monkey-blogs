import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Follow_Profile from "../models/mysql/Follow_Profile.js";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import Block from "../models/mysql/Block.js";

// ==================== follow a profile ==================== //
const followAProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const profile = await Profile.findByPk(id, {
    include: {
      model: User,
      as: "userInfo",
      where: { status: "normal" },
      attributes: [],
    },
    attributes: ["id", "fullname"],
  });

  if (!profile) throw ErrorResponse(404, "Profile not found");

  if (profile.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Can not follow yourself");
  }

  const block = await Block.findOne({
    blockerId: profile.id,
    blockedId: me.profileInfo.id,
  });

  if (block)
    throw ErrorResponse(
      400,
      `You can't follow ${profile.fullname}, they already blocked you`
    );

  const followProfile = await Follow_Profile.findOne({
    where: { followedId: profile.id, followerId: me.profileInfo.id },
    attributes: ["id"],
  });

  if (!followProfile) {
    await Promise.all([
      Follow_Profile.create({
        followedId: profile.id,
        followerId: me.profileInfo.id,
      }),
      me.profileInfo.increment({ followingCount: 1 }),
      profile.increment({ followersCount: 1 }),
    ]);
  }

  res.status(201).json({
    success: true,
    message: `Successfully followed ${profile.fullname}.`,
  });
});

// ==================== unfollow a profile ==================== //
const unFollowAProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const profile = await Profile.findByPk(id, {
    include: {
      model: User,
      as: "userInfo",
      where: { status: "normal" },
      attributes: [],
    },
    attributes: ["id", "fullname"],
  });

  if (!profile) throw ErrorResponse(404, "Profile not found");

  if (profile.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Can not unfollow yourself");
  }

  const followProfile = await Follow_Profile.findOne({
    where: { followedId: profile.id, followerId: me.profileInfo.id },
    attributes: ["id"],
  });

  if (followProfile) {
    await Promise.all([
      followProfile.destroy(),
      me.profileInfo.increment({ followingCount: -1 }),
      profile.increment({ followersCount: -1 }),
    ]);
  }

  res.json({
    success: true,
    message: `Successfully unfollowed ${profile.fullname}.`,
  });
});

// ==================== get list of followed profiles ==================== //
const getFolloweds = asyncMiddleware(async (req, res, next) => {
  const me = req.me ? req.me : null;
  const { username } = req.params;
  const { skip = 0, limit = 15 } = req.query;

  const user = await User.findOne({
    where: { username, status: "normal" },
    attributes: [],
    include: {
      model: Profile,
      as: "profileInfo",
      attributes: ["id", "fullname"],
    },
  });

  if (!user.profileInfo) throw ErrorResponse(404, "Profile not found");

  let followProfiles = await Follow_Profile.findAll({
    where: { followerId: user.profileInfo.id, id: { [Op.gt]: skip } },
    attributes: ["id"],
    include: {
      model: Profile,
      as: "followed",
      attributes: ["id", "fullname", "avatar", "bio"],
      include: { model: User, as: "userInfo", attributes: ["username"] },
    },
    limit: Number(limit) ? Number(limit) : null,
  });

  let followeds;

  if (!me) {
    followeds = followProfiles.map((followProfile) => {
      followProfile.followed.avatar = addUrlToImg(
        followProfile.followed.avatar
      );
      return {
        id: followProfile.followed.id,
        fullname: followProfile.followed.fullname,
        avatar: followProfile.followed.avatar,
        bio: followProfile.followed.bio,
        username: followProfile.followed.userInfo.username,
      };
    });
  }

  if (me && me.profileInfo.id === user.profileInfo.id) {
    followeds = followProfiles.map((followProfile) => {
      followProfile.followed.avatar = addUrlToImg(
        followProfile.followed.avatar
      );
      return {
        id: followProfile.followed.id,
        fullname: followProfile.followed.fullname,
        avatar: followProfile.followed.avatar,
        bio: followProfile.followed.bio,
        username: followProfile.followed.userInfo.username,
        isFollowed: true,
      };
    });
  }

  if (me && me.profileInfo.id !== user.profileInfo.id) {
    const isBlockedByUser = !!(await Block.findOne({
      where: { blockedId: me.profileInfo.id, blockerId: user.profileInfo.id },
      attributes: ["id"],
    }));

    if (isBlockedByUser) {
      throw ErrorResponse(
        403,
        `You have been blocked by ${user.profileInfo.fullname}`
      );
    }

    followeds = await Promise.all(
      followProfiles.map(async (followProfile) => {
        followProfile.followed.avatar = addUrlToImg(
          followProfile.followed.avatar
        );
        return {
          id: followProfile.followed.id,
          fullname: followProfile.followed.fullname,
          avatar: followProfile.followed.avatar,
          bio: followProfile.followed.bio,
          username: followProfile.followed.userInfo.username,
          isFollowed: !!(await Follow_Profile.findOne({
            where: {
              followedId: followProfile.followed.id,
              followerId: me.profileInfo.id,
            },
          })),
          isBlocked: !!(await Block.findOne({
            where: {
              blockedId: followProfile.followed.id,
              blockerId: me.profileInfo.id,
            },
            attributes: ["id"],
          })),
        };
      })
    );
  }

  const newSkip =
    followProfiles.length > 0
      ? followProfiles[followProfiles.length - 1].id
      : null;

  res.json({ success: true, data: followeds, newSkip });
});

// ==================== get list of follower profiles ==================== //
const getFollowers = asyncMiddleware(async (req, res, next) => {
  const me = req.me ? req.me : null;
  const { username } = req.params;
  const { skip = 0, limit = 15 } = req.query;

  const user = await User.findOne({
    where: { username, status: "normal" },
    attributes: [],
    include: {
      model: Profile,
      as: "profileInfo",
      attributes: ["id", "fullname"],
    },
  });

  if (!user.profileInfo) throw ErrorResponse(404, "Profile not found");

  let followerProfiles = await Follow_Profile.findAll({
    where: { followedId: user.profileInfo.id, id: { [Op.gt]: skip } },
    attributes: ["id"],
    include: {
      model: Profile,
      as: "follower",
      attributes: ["id", "fullname", "avatar", "bio"],
      include: { model: User, as: "userInfo", attributes: ["username"] },
    },
    limit: Number(limit) ? Number(limit) : null,
  });

  let followers;

  if (!me) {
    followers = followerProfiles.map((followerProfile) => {
      followerProfile.follower.avatar = addUrlToImg(
        followerProfile.follower.avatar
      );
      return {
        id: followerProfile.follower.id,
        fullname: followerProfile.follower.fullname,
        avatar: followerProfile.follower.avatar,
        bio: followerProfile.follower.bio,
        username: followerProfile.follower.userInfo.username,
      };
    });
  }

  if (me && me.profileInfo.id === user.profileInfo.id) {
    followers = await Promise.all(
      followerProfiles.map(async (followerProfile) => {
        followerProfile.follower.avatar = addUrlToImg(
          followerProfile.follower.avatar
        );
        return {
          id: followerProfile.follower.id,
          fullname: followerProfile.follower.fullname,
          avatar: followerProfile.follower.avatar,
          bio: followerProfile.follower.bio,
          username: followerProfile.follower.userInfo.username,
          isFollowed: !!(await Follow_Profile.findOne({
            where: {
              followedId: followerProfile.follower.id,
              followerId: me.profileInfo.id,
            },
          })),
        };
      })
    );
  }

  if (me && me.profileInfo.id !== user.profileInfo.id) {
    const isBlockedByUser = !!(await Block.findOne({
      where: { blockedId: me.profileInfo.id, blockerId: user.profileInfo.id },
      attributes: ["id"],
    }));

    if (isBlockedByUser) {
      throw ErrorResponse(
        403,
        `You have been blocked by ${user.profileInfo.fullname}`
      );
    }

    followers = await Promise.all(
      followerProfiles.map(async (followerProfile) => {
        followerProfile.follower.avatar = addUrlToImg(
          followerProfile.follower.avatar
        );
        return {
          id: followerProfile.follower.id,
          fullname: followerProfile.follower.fullname,
          avatar: followerProfile.follower.avatar,
          bio: followerProfile.follower.bio,
          username: followerProfile.follower.userInfo.username,
          isFollowed: !!(await Follow_Profile.findOne({
            where: {
              followedId: followerProfile.follower.id,
              followerId: me.profileInfo.id,
            },
            attributes: ["id"],
          })),
          isBlocked: !!(await Block.findOne({
            where: {
              blockedId: followerProfile.follower.id,
              blockerId: me.profileInfo.id,
            },
            attributes: ["id"],
          })),
        };
      })
    );
  }

  const newSkip =
    followerProfiles.length > 0
      ? followerProfiles[followerProfiles.length - 1].id
      : null;

  res.json({ success: true, data: followers, newSkip });
});

export default { followAProfile, unFollowAProfile, getFolloweds, getFollowers };
