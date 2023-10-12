const Profile = require("../models/Profile");
const addUrlToImg = require("../utils/addUrlToImg");
const FollowTopic = require("../models/FollowTopic");
const { removeFile } = require("../utils/removeFile");
const FollowProfile = require("../models/FollowProfile");
const { asyncMiddleware } = require("../middlewares/asyncMiddleware");

// ==================== get profile detail ==================== //

const getProfile = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;

  const response = { profile: userProfile };

  if (myProfile) {
    if (myProfile.id.toString() !== userProfile.id.toString()) {
      response.isFollowing = (await FollowProfile.findOne({
        follower: myProfile._id,
        following: userProfile._id,
      }))
        ? true
        : false;
    } else {
      response.isMyProfile = true;
    }
  }

  response.followerCount = await FollowProfile.countDocuments({
    following: userProfile._id,
  });

  response.followingCount = await FollowProfile.countDocuments({
    follower: userProfile._id,
  });

  userProfile.avatar = addUrlToImg(userProfile.avatar);

  res.status(200).json({
    success: true,
    data: response,
  });
});

// ==================== get following ==================== //

// get following
const getFollowing = asyncMiddleware(async (req, res, next) => {
  const { myProfile, userProfile } = req;
  const limit = parseInt(req.query.limit) || 10;

  const followingDocs = await FollowProfile.find({
    follower: userProfile._id,
    following: { $ne: myProfile ? myProfile._id : null },
  })
    .select("follower following")
    .populate({
      path: "following",
      select: "avatar fullname username bio",
    })
    .limit(limit);

  const myProfileId = myProfile ? myProfile._id.toString() : null;
  const following = followingDocs.map((followingDoc) => {
    const followingData = { ...followingDoc.following.toObject() };
    if (followingData.avatar) {
      followingData.avatar = addUrlToImg(followingData.avatar);
    }
    return myProfileId
      ? {
          ...followingData,
          isFollowing: myProfileId === followingDoc.follower._id.toString(),
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

  const followerDocs = await FollowProfile.find({
    following: userProfile._id,
    follower: { $ne: myProfile ? myProfile._id : null },
  })
    .select("follower following")
    .populate({
      path: "follower",
      select: "avatar fullname username bio",
    });

  const myProfileId = myProfile ? myProfile._id.toString() : null;
  const followers = followerDocs.map((followerDoc) => {
    const followersData = { ...followerDoc.follower.toObject() };
    if (followersData.avatar) {
      followersData.avatar = addUrlToImg(followersData.avatar);
    }
    return myProfileId
      ? {
          ...followersData,
          isFollowing: myProfileId === followerDoc.following._id.toString(),
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

// ==================== update my profile ==================== //

const updateMyProfile = asyncMiddleware(async (req, res, next) => {
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
  getFollowing,
  getFollowers,
  getMyFollowingTopics,
  updateMyProfile,
};
