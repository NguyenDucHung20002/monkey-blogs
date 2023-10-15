const User = require("../models/User");
const FollowUser = require("../models/FollowUser");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { removeFile } = require("../utils/removeFile");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");
const Article = require("../models/Article");

// ==================== get profile detail ==================== //

const getProfile = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;

  const response = { profile: userProfile };

  if (myProfile) {
    if (myProfile.id.toString() !== userProfile.id.toString()) {
      response.isFollowing = (await FollowUser.findOne({
        follower: myProfile._id,
        following: userProfile._id,
      }))
        ? true
        : false;
    } else {
      response.isMyProfile = true;
    }
  }

  response.followerCount = await FollowUser.countDocuments({
    following: userProfile._id,
  });

  response.followingCount = await FollowUser.countDocuments({
    follower: userProfile._id,
  });

  res.status(200).json({
    success: true,
    data: response,
  });
});

// ==================== get following ==================== //

const getFollowing = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;

  const followingDocs = await FollowUser.find({
    follower: userProfile._id,
    following: {
      $ne: myProfile ? myProfile._id : null,
    },
  })
    .select("follower following")
    .populate({
      path: "following",
      select: "avatar fullname username bio",
    });

  const following = followingDocs.map((doc) => {
    const followingData = { ...doc.following.toObject() };
    if (followingData && followingData.avatar) {
      followingData.avatar = addUrlToImg(followingData.avatar);
    }
    return myProfile
      ? {
          ...followingData,
          isFollowing: myProfile._id.toString() === doc.follower._id.toString(),
        }
      : followingData;
  });

  res.status(200).json({
    success: true,
    data: following,
  });
});

// ==================== get followers ==================== //

const getFollowers = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;

  const followerDocs = await FollowUser.find({
    follower: {
      $ne: myProfile ? myProfile._id : null,
    },
    following: userProfile._id,
  })
    .select("follower")
    .populate({ path: "follower", select: "avatar fullname username bio" });

  const followingDocs = await FollowUser.find({
    follower: userProfile._id,
    following: {
      $ne: myProfile ? myProfile._id : null,
    },
  }).select("following");

  const followingIds = followingDocs.map((doc) => doc.following.toString());

  const followers = followerDocs.map((doc) => {
    const followersData = { ...doc.follower.toObject() };
    if (followersData && followersData.avatar) {
      followersData.avatar = addUrlToImg(followersData.avatar);
    }
    return myProfile
      ? {
          ...followersData,
          isFollowing: followingIds.includes(doc.follower._id.toString()),
        }
      : followersData;
  });

  res.status(200).json({
    success: true,
    data: followers,
  });
});

// ==================== get my following topics ==================== //

const getMyFollowingTopics = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;

  const topics = await FollowTopic.find({
    follower: myProfile._id,
  })
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

// ==================== get user articles ==================== //

const getUserArticles = asyncMiddleware(async (req, res, next) => {
  const { userProfile } = req;

  const articles = await Article.find({ author: userProfile._id })
    .select("title preview img slug topics createdAt updatedAt ")
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

// ==================== update my profile ==================== //

const updateMyProfile = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;
  const { fullname, bio, about } = req.body;

  const filename = req.file?.filename;

  await User.findByIdAndUpdate(
    myProfile._id,
    {
      fullname,
      bio,
      about,
      avatar: filename,
    },
    { new: true }
  );

  if (filename) {
    removeFile(myProfile.avatar);
  }

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  getProfile,
  getFollowing,
  getFollowers,
  getMyFollowingTopics,
  updateMyProfile,
  getUserArticles,
};