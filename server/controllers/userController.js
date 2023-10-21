const User = require("../models/User");
const Block = require("../models/Block");
const Article = require("../models/Article");
const FollowUser = require("../models/FollowUser");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { removeFile } = require("../utils/removeFile");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== get profile detail ==================== //

const getProfile = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;

  const result = { ...user };

  if (!me) {
    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  result.isMe = me._id.toString() === user._id.toString();

  if (!result.isMe) {
    result.isFollowed = !!(await FollowUser.exists({
      follower: me._id,
      following: user._id,
    }));
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

// ==================== count following ==================== //

const countFollowing = asyncMiddleware(async (req, res, next) => {
  const { user } = req;

  const count = await FollowUser.countDocuments({
    follower: user._id,
  });

  res.status(200).json({
    success: true,
    data: count,
  });
});

// ==================== count follower ==================== //

const countFollower = asyncMiddleware(async (req, res, next) => {
  const { user } = req;

  const count = await FollowUser.countDocuments({
    following: user._id,
  });

  res.status(200).json({
    success: true,
    data: count,
  });
});

// ==================== get following ==================== //

const getFollowing = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;
  const { page = 1, limit = 15 } = req.query;

  const skip = (page - 1) * limit;

  const followingDocs = await FollowUser.find({
    follower: user._id,
    following: { $ne: me ? me._id : undefined },
  })
    .lean()
    .skip(skip)
    .limit(limit)
    .select("follower following")
    .populate({ path: "following", select: "avatar fullname username bio" });

  result = followingDocs.map((doc) => {
    const following = { ...doc.following };
    following.avatar = addUrlToImg(following.avatar);
    return me && me._id.toString() !== user._id.toString()
      ? {
          ...following,
          isFollowed: me._id.toString() === doc.follower._id.toString(),
        }
      : following;
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

// ==================== get followers ==================== //

const getFollowers = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;
  const { page = 1, limit = 15 } = req.query;

  const skip = (page - 1) * limit;

  const followerDocs = await FollowUser.find({
    follower: { $ne: me ? me._id : null },
    following: user._id,
  })
    .lean()
    .skip(skip)
    .limit(limit)
    .select("follower")
    .populate({ path: "follower", select: "avatar fullname username bio" });

  const result = await Promise.all(
    followerDocs.map(async (doc) => {
      doc.follower.avatar = addUrlToImg(doc.follower.avatar);
      return me
        ? {
            ...doc.follower,
            isFollowed: !!(await FollowUser.exists({
              follower: me._id,
              following: doc.follower,
            })),
          }
        : doc.follower;
    })
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

// ==================== get user articles ==================== //

const getUserArticles = asyncMiddleware(async (req, res, next) => {
  const { user } = req;
  const { page = 1, limit = 15 } = req.query;

  const skip = (page - 1) * limit;

  const articles = await Article.find({ author: user._id })
    .lean()
    .skip(skip)
    .limit(limit)
    .select("-author -content")
    .populate({ path: "topics", options: { limit: 1 }, select: "name slug" })
    .sort({ createdAt: -1 });

  articles.forEach((article) => {
    article.img = addUrlToImg(article.img);
  });

  res.status(200).json({
    success: true,
    data: articles,
  });
});

// ==================== get my following topics ==================== //

const getMyFollowingTopics = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { page = 1, limit = 15 } = req.query;

  const skip = (page - 1) * limit;

  const topicDocs = await FollowTopic.find({ follower: me._id })
    .lean()
    .skip(skip)
    .limit(limit)
    .select("topic")
    .populate({ path: "topic", select: "name slug" });

  const result = topicDocs.map((doc) => {
    return doc.topic;
  });

  res.status(200).json({
    success: result,
  });
});

// ==================== update my profile ==================== //

const updateMyProfile = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { fullname, bio, about } = req.body;

  const filename = req.file?.filename;

  await User.findByIdAndUpdate(
    me._id,
    {
      fullname,
      bio,
      about,
      avatar: filename,
    },
    { new: true }
  );

  if (filename) {
    removeFile(me.avatar);
  }

  res.status(200).json({
    success: true,
  });
});

// ==================== get random users suggestions ==================== //

const getRandomUsers = asyncMiddleware(async (req, res, next) => {
  const { me } = req;

  const myFollowing = await FollowUser.find({ follower: me._id })
    .lean()
    .distinct("following");

  const users = await User.aggregate()
    .match({ _id: { $nin: myFollowing, $ne: me._id } })
    .project("avatar fullname username bio")
    .sample(15);

  users.forEach((user) => {
    user.avatar = addUrlToImg(user.avatar);
  });

  res.status(200).json({
    success: true,
    data: users,
  });
});

// ==================== search users ==================== //

const searchUser = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { search } = req.body;
  const { page = 1, limit = 15 } = req.query;

  const skip = (page - 1) * limit;

  let result = [];

  const regex = new RegExp(search, "i");

  if (search) {
    const users = await User.find()
      .or([
        {
          fullname: regex,
        },
        {
          username: regex,
        },
      ])
      .and([{ _id: { $ne: me ? me._id : null } }])
      .lean()
      .skip(skip)
      .limit(limit)
      .select("avatar fullname username")
      .sort({ createdAt: -1 });

    result = await Promise.all(
      users.map(async (user) => {
        user.avatar = addUrlToImg(user.avatar);
        return me
          ? {
              ...user,
              isFollowing: !!(await FollowUser.exists({
                follower: me._id,
                following: user._id,
              })),
            }
          : user;
      })
    );
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

// ==================== get block list ==================== //

const getBlockList = asyncMiddleware(async (req, res, next) => {
  const { me } = req;

  const blocks = await Block.find({ user: me._id })
    .lean()
    .select("block")
    .populate({
      path: "block",
      select: "avatar fullname username",
    });

  res.status(200).json({
    success: true,
    data: blocks,
  });
});

module.exports = {
  getProfile,
  countFollowing,
  countFollower,
  getFollowing,
  getFollowers,
  getMyFollowingTopics,
  updateMyProfile,
  getUserArticles,
  getRandomUsers,
  searchUser,
  getBlockList,
};
