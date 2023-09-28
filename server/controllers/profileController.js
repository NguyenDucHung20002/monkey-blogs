const Profile = require("../models/Profile");
const { removeFile } = require("../utils/removeFile");
const FollowerShip = require("../models/FollowerShip");
const { ErrorResponse } = require("../response/ErrorResponse");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// get my profile
const getMyProfile = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;

  const profile = await Profile.findOne({ user });
  if (!profile) {
    throw new ErrorResponse(404, "profile not found");
  }

  const followerCount = await FollowerShip.countDocuments({
    following: profile._id,
  });

  const followingCount = await FollowerShip.countDocuments({
    follower: profile._id,
  });

  res.status(200).json({
    success: true,
    data: { profile, followerCount, followingCount },
  });
});

// update my profile
const updateMyProfile = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;
  const { fullname, bio, about } = req.body;

  const filename = req.file?.filename;

  let oldProfile = await Profile.findOne({ user });
  if (!oldProfile) {
    throw new ErrorResponse(404, "Profile not found");
  }

  await Profile.findOneAndUpdate(
    { user },
    {
      fullname,
      bio,
      about,
      avatar: filename,
    },
    { new: true }
  );

  if (filename) {
    removeFile(oldProfile.avatar);
  }

  res.status(200).json({
    success: true,
  });
});

// http://localhost:8080/api/auth/username/followers?limit=10&page=1

// get my followers
const getMyFollowers = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;

  const profile = await Profile.findOne({ user });
  if (!profile) {
    throw new ErrorResponse(404, "profile not found");
  }

  if (profile.user != user) {
    throw new ErrorResponse(401, "Unauthorized");
  }

  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 10;

  const followers = await FollowerShip.find({
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

// get my following
const getMyFollowing = asyncMiddleware(async (req, res, next) => {
  const { id: user } = req.user;

  const profile = await Profile.findOne({ user });
  if (!profile) {
    throw new ErrorResponse(404, "profile not found");
  }

  const following = await FollowerShip.find({
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

// get a user profile
const getAUserProfile = asyncMiddleware(async (req, res, next) => {
  const { username } = req.params;

  const userProfile = await Profile.findOne({ username });
  if (!userProfile) {
    throw new ErrorResponse(404, "user profile not found");
  }

  const followerCount = await FollowerShip.countDocuments({
    following: userProfile._id,
  });

  const followingCount = await FollowerShip.countDocuments({
    follower: userProfile._id,
  });

  res.status(200).json({
    success: true,
    data: { userProfile, followerCount, followingCount },
  });
});

// get user followers
const getUserFollowers = asyncMiddleware(async (req, res, next) => {
  const { username } = req.params;

  const userProfile = await Profile.findOne({ username });
  if (!userProfile) {
    throw new ErrorResponse(404, "user profile not found");
  }

  const userFollowers = await FollowerShip.find({
    following: userProfile._id,
  })
    .select("follower")
    .populate({
      path: "follower",
      select: "avatar fullname username bio",
    });

  res.status(200).json({
    success: true,
    data: userFollowers,
  });
});

// get user following
const getUserFollowing = asyncMiddleware(async (req, res, next) => {
  const { username } = req.params;

  const userProfile = await Profile.findOne({ username });
  if (!userProfile) {
    throw new ErrorResponse(404, "user profile not found");
  }

  const userFollowing = await FollowerShip.find({
    follower: userProfile._id,
  })
    .select("following")
    .populate({
      path: "following",
      select: "avatar fullname username bio",
    });

  res.status(200).json({
    success: true,
    data: userFollowing,
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  getMyFollowers,
  getMyFollowing,
  getAUserProfile,
  getUserFollowers,
  getUserFollowing,
};
