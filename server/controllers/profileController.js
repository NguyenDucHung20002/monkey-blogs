const Profile = require("../models/Profile");
const { removeFile } = require("../utils/removeFile");
const FollowProfile = require("../models/FollowProfile");
const FollowTopic = require("../models/FollowTopic");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// get profile
const getProfile = asyncMiddleware(async (req, res, next) => {
  const { profile } = req;

  const followerCount = await FollowProfile.countDocuments({
    following: profile._id,
  });

  const followingCount = await FollowProfile.countDocuments({
    follower: profile._id,
  });

  res.status(200).json({
    success: true,
    data: { profile, followerCount, followingCount },
  });
});

// update my profile
const updateProfile = asyncMiddleware(async (req, res, next) => {
  const { profile } = req;
  const { fullname, bio, about } = req.body;

  const filename = req.file?.filename;

  await Profile.findOneAndUpdate(
    { user: profile.user },
    {
      fullname,
      bio,
      about,
      avatar: filename,
    },
    { new: true }
  );

  if (filename) {
    removeFile(profile.avatar);
  }

  res.status(200).json({
    success: true,
  });
});

// http://localhost:8080/api/auth/username/followers?limit=10&page=1

// get followers
const getFollowers = asyncMiddleware(async (req, res, next) => {
  const { profile } = req;

  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 10;

  const followers = await FollowProfile.find({
    following: profile._id,
  })
    .select("follower")
    .populate({
      path: "follower",
      select: "avatar fullname username bio",
    });
  // .skip(skip)
  // .limit(limit);

  res.status(200).json({
    success: true,
    data: followers,
    // currentPage: page,
    // totalPages: Math.ceil(followers.length / limit),
  });
});

// get  following
const getFollowing = asyncMiddleware(async (req, res, next) => {
  const { profile } = req;

  const following = await FollowProfile.find({
    follower: profile._id,
  })
    .select("following")
    .populate({
      path: "following",
      select: "avatar fullname username bio",
    });

  res.status(200).json({
    success: true,
    data: following,
  });
});

// get following topics
const getFollowingTopics = asyncMiddleware(async (req, res, next) => {
  const { profile } = req;

  const followingTopics = await FollowTopic.find({
    follower: profile._id,
  })
    .select("topic")
    .populate({
      path: "topic",
      select: "name slug",
    });

  res.status(200).json({
    success: true,
    data: followingTopics,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getFollowers,
  getFollowing,
  getFollowingTopics,
};
