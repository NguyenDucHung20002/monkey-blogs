const Profile = require("../models/Profile");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { removeFile } = require("../utils/removeFile");
const FollowProfile = require("../models/FollowProfile");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// get profile detail
const getProfile = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;

  let profile;

  if (myProfile || userProfile) {
    profile = myProfile || userProfile;
  }

  const followerCount = await FollowProfile.countDocuments({
    following: profile._id,
  });
  const followingCount = await FollowProfile.countDocuments({
    follower: profile._id,
  });

  profile.avatar = addUrlToImg(profile.avatar);

  res.status(200).json({
    success: true,
    data: { profile, followerCount, followingCount },
  });
});

// get followers
const getFollowers = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let profile;

  if (myProfile || userProfile) {
    profile = myProfile || userProfile;
  }

  const followers = await FollowProfile.find({
    follower: profile._id,
  })
    .select("follower")
    .populate({
      path: "follower",
      select: "avatar fullname username bio",
    })
    .skip(skip)
    .limit(limit);

  followers.forEach((user) => {
    if (user.follower && user.follower.avatar) {
      user.follower.avatar = addUrlToImg(user.follower.avatar);
    }
  });

  const totalPages = Math.ceil(followers.length / limit);

  res.status(200).json({
    success: true,
    data: followers,
    currentPage: page,
    totalPages,
  });
});

// get my following
const getFollowing = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let profile;

  if (myProfile || userProfile) {
    profile = myProfile || userProfile;
  }

  const following = await FollowProfile.find({
    follower: profile._id,
  })
    .select("following")
    .populate({
      path: "following",
      select: "avatar fullname username bio",
    })
    .skip(skip)
    .limit(limit);

  following.forEach((user) => {
    if (user.following && user.following.avatar) {
      user.following.avatar = addUrlToImg(user.following.avatar);
    }
  });

  const totalPages = Math.ceil(following.length / limit);

  res.status(200).json({
    success: true,
    data: following,
    currentPage: page,
    totalPages,
  });
});

// get following topics
const getFollowingTopics = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let profile;

  if (myProfile || userProfile) {
    profile = myProfile || userProfile;
  }

  const followingTopics = await FollowTopic.find({
    follower: profile._id,
  })
    .select("topic")
    .populate({
      path: "topic",
      select: "name slug",
    })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(followingTopics.length / limit);

  res.status(200).json({
    success: true,
    data: followingTopics,
    currentPage: page,
    totalPages,
  });
});

// update profile
const updateProfile = asyncMiddleware(async (req, res, next) => {
  const { myProfile } = req;
  const { fullname, bio, about } = req.body;

  const filename = req.file?.filename;

  await Profile.findOneAndUpdate(
    { user: myProfile.user },
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
  getFollowers,
  getFollowing,
  getFollowingTopics,
  updateProfile,
};
