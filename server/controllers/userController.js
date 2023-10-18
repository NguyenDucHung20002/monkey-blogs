const User = require("../models/User");
const Article = require("../models/Article");
const FollowUser = require("../models/FollowUser");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { removeFile } = require("../utils/removeFile");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== get profile detail ==================== //

const getProfile = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;

  const profile = { profile: user };

  if (me) {
    profile.isMyProfile = me._id.toString() === user._id.toString();
    if (!profile.isMyProfile) {
      profile.isFollowing = (await FollowUser.exists({
        follower: me._id,
        following: user._id,
      }))
        ? true
        : false;
    }
  }

  const [followerCount, followingCount] = await Promise.all([
    FollowUser.countDocuments({ following: user._id }),
    FollowUser.countDocuments({ follower: user._id }),
  ]);

  profile.followerCount = followerCount;
  profile.followingCount = followingCount;

  res.status(200).json({
    success: true,
    data: profile,
  });
});

// ==================== get following ==================== //

const getFollowing = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const followingDocs = await FollowUser.find({
    follower: user._id,
    following: { $ne: me ? me._id : null },
  })
    .lean()
    .skip(skip)
    .limit(limit)
    .select("follower following")
    .populate({
      path: "following",
      select: "avatar fullname username bio",
    });

  const following = followingDocs.map((doc) => {
    const following = { ...doc.following };
    if (following && following.avatar) {
      following.avatar = addUrlToImg(following.avatar);
    }
    return me
      ? {
          ...following,
          isFollowing: me._id.toString() === doc.follower._id.toString(),
        }
      : following;
  });

  res.status(200).json({
    success: true,
    data: following,
  });
});

// ==================== get followers ==================== //

const getFollowers = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;
  const { page = 1, limit = 10 } = req.query;

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

  const followers = await Promise.all(
    followerDocs.map(async (doc) => {
      if (doc && doc.follower && doc.follower.avatar) {
        doc.follower.avatar = addUrlToImg(doc.follower.avatar);
      }
      return me
        ? {
            ...doc.follower,
            isFollowing: (await FollowUser.exists({
              follower: me._id,
              following: doc.follower,
            }))
              ? true
              : false,
          }
        : doc.follower;
    })
  );

  res.status(200).json({
    success: true,
    data: followers,
  });
});

// ==================== get user articles ==================== //

const getUserArticles = asyncMiddleware(async (req, res, next) => {
  const { user } = req;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const articles = await Article.find({ author: user._id })
    .lean()
    .skip(skip)
    .limit(limit)
    .select("-author -content")
    .populate({
      path: "topics",
      options: { limit: 1 },
      select: "name slug",
    })
    .sort({ createdAt: -1 });

  articles.forEach((article) => {
    if (article && article.img) {
      article.img = addUrlToImg(article.img);
    }
  });

  res.status(200).json({
    success: true,
    data: articles,
  });
});

// ==================== get my following topics ==================== //

const getMyFollowingTopics = asyncMiddleware(async (req, res, next) => {
  const { me } = req;

  const topics = await FollowTopic.find({ follower: me._id })
    .lean()
    .select("topic")
    .populate({
      path: "topic",
      select: "name slug",
    });

  res.status(200).json({
    success: true,
    data: topics,
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
    if (user && user.avatar) {
      user.avatar = addUrlToImg(user.avatar);
    }
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
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  let users = [];

  if (search) {
    users = await User.find()
      .and([
        { fullname: new RegExp(search, "i") },
        { _id: { $ne: me ? me._id : null } },
      ])
      .lean()
      .skip(skip)
      .limit(limit)
      .select("avatar fullname username")
      .sort({ createdAt: -1 });

    users = await Promise.all(
      users.map(async (user) => {
        if (user && user.avatar) {
          user.avatar = addUrlToImg(user.avatar);
        }
        return me
          ? {
              ...user,
              isFollowing: (await FollowUser.exists({
                follower: me._id,
                following: user._id,
              }))
                ? true
                : false,
            }
          : user;
      })
    );
  }

  res.status(200).json({
    success: true,
    data: users,
  });
});

module.exports = {
  getProfile,
  getFollowing,
  getFollowers,
  getMyFollowingTopics,
  updateMyProfile,
  getUserArticles,
  getRandomUsers,
  searchUser,
};
