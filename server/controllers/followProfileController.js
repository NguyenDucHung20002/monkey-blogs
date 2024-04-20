import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Follow_Profile from "../models/mysql/Follow_Profile.js";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import Block from "../models/mysql/Block.js";
import Role from "../models/mysql/Role.js";
import sequelize from "../databases/mysql/connect.js";

// ==================== follow a user ==================== //

const followAUser = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;

  if (user.profileInfo.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Cannot follow yourself");
  }

  const followProfile = await Follow_Profile.findOne({
    where: { followedId: user.profileInfo.id, followerId: me.profileInfo.id },
  });

  if (!followProfile) {
    await Follow_Profile.create(
      {
        followedId: user.profileInfo.id,
        followerId: me.profileInfo.id,
      },
      { me: me, user: user }
    );
  }

  res.status(201).json({
    success: true,
    message: `Successfully followed ${user.profileInfo.fullname}.`,
  });
});

// ==================== unfollow a user ==================== //

const unFollowAUser = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;

  if (user.profileInfo.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Bad Request: Cannot un follow yourself");
  }

  const followProfile = await Follow_Profile.findOne({
    where: { followedId: user.profileInfo.id, followerId: me.profileInfo.id },
  });

  if (followProfile) {
    await followProfile.destroy({ me: me, user: user });
  }

  res.json({
    success: true,
    message: `Successfully un followed ${user.profileInfo.fullname}.`,
  });
});

// ==================== get followed profiles ==================== //

const getFollowedProfiles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { followerId: user.profileInfo.id };

  if (skip) whereQuery.createdAt = { [Op.lt]: skip };

  let followedProfiles, result;

  if (me.profileInfo.id === user.profileInfo.id) {
    followedProfiles = await Follow_Profile.findAll({
      where: whereQuery,
      attributes: ["id", "createdAt"],
      include: {
        model: Profile,
        as: "followed",
        attributes: ["id", "fullname", "avatar", "bio"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
      order: [["createdAt", "DESC"]],
      limit: Number(limit) ? Number(limit) : null,
    });

    result = followedProfiles.map((followProfile) => {
      followProfile.followed.avatar = addUrlToImg(
        followProfile.followed.avatar
      );

      return {
        ...followProfile.followed.toJSON(),
        isFollowed: true,
      };
    });
  }

  if (me && me.profileInfo.id !== user.profileInfo.id) {
    followedProfiles = await Follow_Profile.findAll({
      where: {
        ...whereQuery,
        "$followedBlocker.blockerId$": null,
        "$followedBlocked.blockedId$": null,
      },
      attributes: ["id", "createdAt"],
      include: [
        {
          model: Profile,
          as: "followed",
          attributes: ["id", "fullname", "avatar", "bio"],
          include: {
            model: User,
            as: "userInfo",
            attributes: ["username"],
            include: { model: Role, as: "role", attributes: ["slug"] },
          },
          where: { id: { [Op.ne]: me.profileInfo.id } },
        },
        {
          model: Block,
          as: "followedBlocker",
          where: { blockedId: me.profileInfo.id },
          attributes: [],
          required: false,
        },
        {
          model: Block,
          as: "followedBlocked",
          attributes: [],
          where: { blockerId: me.profileInfo.id },
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit) ? Number(limit) : null,
    });

    result = await Promise.all(
      followedProfiles.map(async (followProfile) => {
        const isFollowed = !!(await Follow_Profile.findOne({
          where: {
            followedId: followProfile.followed.id,
            followerId: me.profileInfo.id,
          },
        }));
        followProfile.followed.avatar = addUrlToImg(
          followProfile.followed.avatar
        );

        return {
          ...followProfile.followed.toJSON(),
          isFollowed,
        };
      })
    );
  }

  const newSkip =
    followedProfiles.length > 0
      ? followedProfiles[followedProfiles.length - 1].createdAt
      : null;

  res.json({
    success: true,
    data: result,
    newSkip,
  });
});

// ==================== get follower profiles ==================== //

const getFollowerProfiles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { followedId: user.profileInfo.id };

  if (skip) whereQuery.createdAt = { [Op.lt]: skip };

  let followerProfiles, result;

  if (me.profileInfo.id === user.profileInfo.id) {
    followerProfiles = await Follow_Profile.findAll({
      where: whereQuery,
      attributes: ["id", "createdAt"],
      include: {
        model: Profile,
        as: "follower",
        attributes: ["id", "fullname", "avatar", "bio"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
      order: [["createdAt", "DESC"]],
      limit: Number(limit) ? Number(limit) : null,
    });

    result = await Promise.all(
      followerProfiles.map(async (followerProfile) => {
        const isFollowed = !!(await Follow_Profile.findOne({
          where: {
            followedId: followerProfile.follower.id,
            followerId: me.profileInfo.id,
          },
        }));

        followerProfile.follower.avatar = addUrlToImg(
          followerProfile.follower.avatar
        );

        return {
          ...followerProfile.follower.toJSON(),
          isFollowed,
        };
      })
    );
  }

  if (me.profileInfo.id !== user.profileInfo.id) {
    followerProfiles = await Follow_Profile.findAll({
      where: {
        ...whereQuery,
        "$followerBlocker.blockerId$": null,
        "$followerBlocked.blockedId$": null,
      },
      attributes: ["id", "createdAt"],
      include: [
        {
          model: Profile,
          as: "follower",
          attributes: ["id", "fullname", "avatar", "bio"],
          include: {
            model: User,
            as: "userInfo",
            attributes: ["username"],
            include: { model: Role, as: "role", attributes: ["slug"] },
          },
          where: { id: { [Op.ne]: me.profileInfo.id } },
        },
        {
          model: Block,
          as: "followerBlocker",
          where: { blockedId: me.profileInfo.id },
          attributes: [],
          required: false,
        },
        {
          model: Block,
          as: "followerBlocked",
          attributes: [],
          where: { blockerId: me.profileInfo.id },
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit) ? Number(limit) : null,
    });

    result = await Promise.all(
      followerProfiles.map(async (followerProfile) => {
        const isFollowed = !!(await Follow_Profile.findOne({
          where: {
            followedId: followerProfile.follower.id,
            followerId: me.profileInfo.id,
          },
        }));

        followerProfile.follower.avatar = addUrlToImg(
          followerProfile.follower.avatar
        );
        return {
          ...followerProfile.follower.toJSON(),
          isFollowed,
        };
      })
    );
  }

  const newSkip =
    followerProfiles.length > 0
      ? followerProfiles[followerProfiles.length - 1].createdAt
      : null;

  res.json({
    success: true,
    data: result,
    newSkip,
  });
});

// ==================== who to follow ==================== //

const whoToFollow = asyncMiddleware(async (req, res, next) => {
  const { max = 5 } = req.query;
  const me = req.me;

  let whoToFollow = await sequelize.query(
    `
    SELECT p.id, p.avatar, p.fullname, u.username, r.slug AS role
    FROM articles a
    JOIN profiles p ON a.authorId = p.id and p.avatar is not null and p.fullname is not null
    JOIN users u ON p.userId = u.id and u.isVerified = true and u.status = "normal"
    JOIN roles r ON u.roleId = r.id
    LEFT JOIN reading_histories rh ON rh.articleId = a.id AND rh.profileId = ${me.profileInfo.id}
    LEFT JOIN reading_lists rl ON rl.articleId = a.id AND rl.profileId = ${me.profileInfo.id}
    LEFT JOIN likes l ON l.articleId = a.id AND l.profileId = ${me.profileInfo.id}
    LEFT JOIN articles_topics at ON a.id = at.articleId
    LEFT JOIN topics t ON at.topicId = t.id
    LEFT JOIN follow_topics ft ON ft.topicId = t.id AND ft.profileId = ${me.profileInfo.id}
    where (
      rh.profileId is not null
      or rl.profileId is not null
      or l.profileId is not null
      or ft.profileId is not null
    )
    AND p.id NOT IN (
      SELECT followedId
      FROM follow_profiles
      WHERE followerId = ${me.profileInfo.id}
    )
    GROUP BY p.id, p.avatar, p.fullname, u.username, r.slug
    ORDER BY COUNT(DISTINCT a.id) DESC
    limit ${max}
    `,
    { type: sequelize.QueryTypes.SELECT }
  );

  whoToFollow = whoToFollow.map((whoToFollow) => {
    return {
      id: whoToFollow.id,
      avatar: whoToFollow.avatar,
      fullname: whoToFollow.fullname,
      userInfo: {
        username: whoToFollow.username,
        role: {
          slug: whoToFollow.role,
        },
      },
    };
  });

  if (whoToFollow.length < max) {
    const whoToFollowIds = whoToFollow.map((whoToFollow) => whoToFollow.id);

    let random = await Profile.findAll({
      where: {
        id: {
          [Op.and]: [
            { [Op.notIn]: whoToFollowIds },
            { [Op.ne]: me.profileInfo.id },
          ],
        },
        avatar: { [Op.ne]: null },
        fullname: { [Op.ne]: null },
        "$blocksBlockedBy.blockerId$": null,
        "$blocksBlocked.blockedId$": null,
        "$followeds.followedId$": null,
      },
      attributes: ["id", "fullname", "avatar"],
      include: [
        {
          model: Block,
          as: "blocksBlockedBy",
          where: { blockedId: me.profileInfo.id },
          attributes: [],
          required: false,
        },
        {
          model: Block,
          as: "blocksBlocked",
          attributes: [],
          where: { blockerId: me.profileInfo.id },
          required: false,
        },
        {
          model: Follow_Profile,
          as: "followeds",
          where: { followerId: me.profileInfo.id },
          attributes: [],
          required: false,
        },
        {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          where: { status: "normal", isVerified: true },
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      ],
      order: sequelize.literal("RAND()"),
      limit: max - whoToFollow.length,
    });

    random = random.map((random) => {
      return random;
    });

    whoToFollow.push(...random);
  }

  whoToFollow.forEach((whoToFollow) => addUrlToImg(whoToFollow.avatar));

  res.json({
    success: true,
    data: whoToFollow,
  });
});

export default {
  followAUser,
  unFollowAUser,
  getFollowedProfiles,
  getFollowerProfiles,
  whoToFollow,
};
