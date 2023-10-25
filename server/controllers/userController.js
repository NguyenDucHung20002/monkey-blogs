const User = require("../models/User");
const Article = require("../models/Article");
const FollowUser = require("../models/FollowUser");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { removeFile } = require("../utils/removeFile");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== get profile ==================== //

const getProfile = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;

  const result = { ...user };

  if (!me) {
    return res.status(200).json({ success: true, data: result });
  }

  result.isMe = me._id.toString() === user._id.toString();

  if (!result.isMe) {
    result.isFollowed = !!(await FollowUser.exists({
      follower: me._id,
      following: user._id,
    }));
  }

  res.status(200).json({ success: true, data: result });
});

// ==================== count following ==================== //

const countFollowing = asyncMiddleware(async (req, res, next) => {
  const { user } = req;

  const count = await FollowUser.count({ follower: user._id });

  res.status(200).json({ success: true, data: count });
});

// ==================== count followers ==================== //

const countFollowers = asyncMiddleware(async (req, res, next) => {
  const { user } = req;

  const count = await FollowUser.count({ following: user._id });

  res.status(200).json({ success: true, data: count });
});

// ==================== get following ==================== //

const getFollowing = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;
  const { skip, limit = 15 } = req.query;

  const query = { follower: user._id, following: { $ne: me ? me._id : null } };
  if (skip) query._id = { $gt: skip };

  const following = await FollowUser.find(query)
    .lean()
    .limit(limit)
    .select("follower following")
    .populate({ path: "following", select: "avatar fullname username bio" })
    .sort({ createdAt: -1 });

  const result = following.map((val) => {
    const following = { ...val.following };
    following.avatar = addUrlToImg(following.avatar);
    return me && me._id.toString() !== user._id.toString()
      ? {
          ...following,
          isFollowed: me._id.toString() === val.follower._id.toString(),
        }
      : following;
  });

  const skipID =
    following.length > 0 ? following[following.length - 1]._id : null;

  res.status(200).json({ success: true, data: result, skipID });
});

// ==================== get follower ==================== //

const getFollowers = asyncMiddleware(async (req, res, next) => {
  const { me, user } = req;
  const { skip, limit = 15 } = req.query;

  const query = { follower: { $ne: me ? me._id : null }, following: user._id };
  if (skip) query._id = { $gt: skip };

  const followers = await FollowUser.find(query)
    .lean()
    .limit(limit)
    .select("follower")
    .populate({ path: "follower", select: "avatar fullname username bio" });

  const result = await Promise.all(
    followers.map(async (val) => {
      val.follower.avatar = addUrlToImg(val.follower.avatar);
      return me
        ? {
            ...val.follower,
            isFollowed: !!(await FollowUser.exists({
              follower: me._id,
              following: val.follower,
            })),
          }
        : val.follower;
    })
  );

  const skipID =
    followers.length > 0 ? followers[followers.length - 1]._id : null;

  res.status(200).json({ success: true, data: result, skipID });
});

// ==================== get user articles ==================== //

const getUserArticles = asyncMiddleware(async (req, res, next) => {
  const { user } = req;
  const { skip, limit = 15 } = req.query;

  const query = { author: user._id };
  if (skip) query._id = { $lt: skip };

  const articles = await Article.find(query)
    .lean()
    .limit(limit)
    .select("-author -content -status")
    .populate({ path: "topics", options: { limit: 1 }, select: "name slug" })
    .sort({ createdAt: -1 });

  articles.forEach((val) => (val.img = addUrlToImg(val.img)));

  const skipID = articles.length > 0 ? articles[articles.length - 1]._id : null;

  res.status(200).json({ success: true, data: articles, skipID });
});

// ==================== get followed topics ==================== //

const getMyFollowingTopics = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { skip, limit = 15 } = req.query;

  const query = { follower: me._id };
  if (skip) query._id = { $gt: skip };

  const topics = await FollowTopic.find(query)
    .lean()
    .limit(limit)
    .select("topic")
    .populate({ path: "topic", select: "name slug" })
    .sort({ _id: 1 });

  const result = topics.map((val) => {
    return val.topic;
  });

  const skipID = topics.length > 0 ? topics[topics.length - 1]._id : null;

  res.status(200).json({ success: true, data: result, skipID });
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

  if (filename) removeFile(me.avatar);

  res.status(200).json({ success: true });
});

// ==================== random users suggestions ==================== //

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

  res.status(200).json({ success: true, data: users });
});

// ==================== search users ==================== //

const searchUser = asyncMiddleware(async (req, res, next) => {
  const { me } = req;
  const { search } = req.body;
  const { skip, limit = 15 } = req.query;

  if (search) {
    const query = {
      $text: { $search: search },
      _id: { $ne: me ? me._id : null },
    };

    if (skip) query._id.$lt = skip;

    const users = await User.find(query)
      .lean()
      .limit(limit)
      .select("avatar fullname username bio");

    result = await Promise.all(
      users.map(async (val) => {
        val.avatar = addUrlToImg(val.avatar);
        return me
          ? {
              ...val,
              isFollowed: !!(await FollowUser.exists({
                follower: me._id,
                following: val._id,
              })),
            }
          : val;
      })
    );
  }

  const skipID = result.length > 0 ? result[result.length - 1]._id : null;

  res.status(200).json({ success: true, data: result, skipID });
});

module.exports = {
  getProfile,
  countFollowing,
  countFollowers,
  getFollowing,
  getFollowers,
  getMyFollowingTopics,
  updateMyProfile,
  getUserArticles,
  getRandomUsers,
  searchUser,
};
