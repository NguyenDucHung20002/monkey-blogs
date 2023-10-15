const User = require("../models/User");
const Article = require("../models/Article");
const FollowUser = require("../models/FollowUser");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { removeFile } = require("../utils/removeFile");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== get profile detail ==================== //

const getProfile = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;

  const profile = { profile: userProfile };

  if (myProfile) {
    if (myProfile._id.toString() !== userProfile._id.toString()) {
      profile.isMyProfile = false;
      profile.isFollowing = (await FollowUser.exists({
        follower: myProfile._id,
        following: userProfile._id,
      }))
        ? true
        : false;
    } else {
      profile.isMyProfile = true;
    }
  }

  const [followerCount, followingCount] = await Promise.all([
    FollowUser.countDocuments({ following: userProfile._id }),
    FollowUser.countDocuments({ follower: userProfile._id }),
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
  const { userProfile, myProfile } = req;

  const followingDocs = await FollowUser.find({
    follower: userProfile._id,
    following: {
      $ne: myProfile ? myProfile._id : null,
    },
  })
    .lean()
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
    return myProfile
      ? {
          ...following,
          isFollowing: myProfile._id.toString() === doc.follower._id.toString(),
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
  const { myProfile, userProfile } = req;

  const [followerDocs, followingDocs] = await Promise.all([
    FollowUser.find({
      follower: {
        $ne: myProfile ? myProfile._id : null,
      },
      following: userProfile._id,
    })
      .lean()
      .select("follower")
      .populate({ path: "follower", select: "avatar fullname username bio" }),
    FollowUser.find({
      follower: userProfile._id,
      following: {
        $ne: myProfile ? myProfile._id : null,
      },
    })
      .lean()
      .select("following"),
  ]);

  const followingIds = followingDocs.map((doc) => doc.following.toString());

  const followers = followerDocs.map((doc) => {
    const follower = { ...doc.follower };
    if (follower && follower.avatar) {
      follower.avatar = addUrlToImg(follower.avatar);
    }
    return myProfile
      ? {
          ...follower,
          isFollowing: followingIds.includes(doc.follower._id.toString()),
        }
      : follower;
  });

  res.status(200).json({
    success: true,
    data: followers,
  });
});

// ==================== get user articles ==================== //

const getUserArticles = asyncMiddleware(async (req, res, next) => {
  const { userProfile } = req;

  const articles = await Article.find({ author: userProfile._id })
    .lean()
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
  const myUserId = req.myProfile._id;

  const topics = await FollowTopic.find({
    follower: myUserId,
  })
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
  const { _id: myUserId, avatar } = req.myProfile;
  const { fullname, bio, about } = req.body;

  const filename = req.file?.filename;

  await User.findByIdAndUpdate(
    myUserId,
    {
      fullname,
      bio,
      about,
      avatar: filename,
    },
    { new: true }
  );

  if (filename) {
    removeFile(avatar);
  }

  res.status(200).json({
    success: true,
  });
});

// ==================== get random users suggestions ==================== //

const getRandomUsers = asyncMiddleware(async (req, res, next) => {
  const myUserId = req.myProfile._id;

  const myFollowing = await FollowUser.find({ follower: myUserId })
    .lean()
    .select("following");

  const followingIds = myFollowing.map((myFollowing) => {
    return myFollowing.following;
  });

  const users = await User.aggregate()
    .match({ _id: { $nin: [myUserId, ...followingIds] } })
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
  const { myProfile } = req;
  const { search } = req.body;

  let users = [];

  if (search) {
    users = await User.find()
      .and([
        { fullname: new RegExp(search, "i") },
        { _id: { $ne: myProfile ? myProfile._id : null } },
      ])
      .lean()
      .select("avatar fullname username")
      .sort({ createdAt: -1 });

    const myFollowing = await FollowUser.find({
      follower: myProfile ? myProfile._id : null,
    })
      .lean()
      .select("following");

    const followingIds = myFollowing.map((following) =>
      following.following.toString()
    );

    users = users.map((user) => {
      return myProfile
        ? {
            ...user,
            isFollowing: followingIds.includes(user._id.toString()),
          }
        : {
            ...user,
          };
    });
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
