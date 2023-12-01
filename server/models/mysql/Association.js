import User from "../mysql/User.js";
import Role from "../mysql/Role.js";
import Profile from "../mysql/Profile.js";
import Mute from "../mysql/Mute.js";
import Block from "../mysql/Block.js";
import Report_User from "./Report_User.js";
import Follow_Profile from "./Follow_Profile.js";
import Topic from "../mysql/Topic.js";
import Follow_Topic from "./Follow_Topic.js";
import Article from "./Article.js";
import Article_Topic from "./Article_Topic.js";
import Draft from "./Draft.js";
import Like from "./Like.js";
import Report_Article from "./Report_Article.js";
import Comment from "./Comment.js";
import Reading_History from "./Reading_History.js";

// Role - User (1-n)
Role.hasMany(User, {
  foreignKey: "roleId",
  as: "role",
});
User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

// Profile - User (1-1)
User.hasOne(Profile, {
  foreignKey: "userId",
  as: "profileInfo",
});
Profile.belongsTo(User, {
  foreignKey: "userId",
  as: "userInfo",
});

// Mute - Profile (n-n)
Profile.belongsToMany(Profile, {
  through: Mute,
  foreignKey: "mutedId",
  as: "muters",
});
Profile.belongsToMany(Profile, {
  through: Mute,
  foreignKey: "muterId",
  as: "muteds",
});
Mute.belongsTo(Profile, {
  foreignKey: "mutedId",
  as: "muted",
});
Mute.belongsTo(Profile, {
  foreignKey: "muterId",
  as: "muter",
});

// Block - Profile (n-n)
Profile.belongsToMany(Profile, {
  through: Block,
  foreignKey: "blockedId",
  as: "blockers",
});
Profile.belongsToMany(Profile, {
  through: Block,
  foreignKey: "blockerId",
  as: "blockeds",
});
Block.belongsTo(Profile, {
  foreignKey: "blockedId",
  as: "blocked",
});
Block.belongsTo(Profile, {
  foreignKey: "blockerId",
  as: "blocker",
});

// User - Ban (1-n)
User.hasMany(User, {
  foreignKey: "bannedById",
});
User.belongsTo(User, {
  foreignKey: "bannedById",
  as: "bannedBy",
});

// Report - User (n-n)
Report_User.belongsTo(User, {
  foreignKey: "reportedId",
  as: "reported",
});
Report_User.belongsTo(User, {
  foreignKey: "reporterId",
  as: "reporter",
});
User.hasMany(Report_User, {
  foreignKey: "resolvedById",
});
Report_User.belongsTo(User, {
  foreignKey: "resolvedById",
  as: "resolvedBy",
});

// Follow - Profile (n-n)
Profile.belongsToMany(Profile, {
  through: Follow_Profile,
  foreignKey: "followedId",
  as: "followers",
});
Profile.belongsToMany(Profile, {
  through: Follow_Profile,
  foreignKey: "followerId",
  as: "follweds",
});
Follow_Profile.belongsTo(Profile, {
  foreignKey: "followedId",
  as: "followed",
});
Follow_Profile.belongsTo(Profile, {
  foreignKey: "followerId",
  as: "follower",
});

// Follow - Block (1-1)
Follow_Profile.hasOne(Block, {
  sourceKey: "followedId",
  foreignKey: "blockedId",
  as: "blockedFollowed",
});
Block.belongsTo(Follow_Profile, {
  sourceKey: "followedId",
  foreignKey: "blockedId",
  as: "blockedFollowed",
});
Follow_Profile.hasOne(Block, {
  sourceKey: "followerId",
  foreignKey: "blockedId",
  as: "blockerFollower",
});
Block.belongsTo(Follow_Profile, {
  sourceKey: "followerId",
  foreignKey: "blockedId",
  as: "blockerFollower",
});

// Topic - Profile (n-n)
Profile.belongsToMany(Topic, {
  through: Follow_Topic,
  foreignKey: "profileId",
  as: "followedTopics",
});
Topic.belongsToMany(Profile, {
  through: Follow_Topic,
  foreignKey: "topicId",
  as: "followers",
});
Follow_Topic.belongsTo(Profile, {
  foreignKey: "profileId",
  as: "profileFollowed",
});
Follow_Topic.belongsTo(Topic, {
  foreignKey: "topicId",
  as: "topicFollower",
});

// Profile - Draft (1-n)
Profile.hasMany(Draft, {
  foreignKey: "authorId",
});
Draft.belongsTo(Profile, {
  foreignKey: "authorId",
});

// Article - Topic (n-n)
Article.belongsToMany(Topic, {
  through: Article_Topic,
  foreignKey: "articleId",
  as: "articleTopics",
});
Topic.belongsToMany(Article, {
  through: Article_Topic,
  foreignKey: "topicId",
  as: "topicArticles",
});
Article_Topic.belongsTo(Article, {
  foreignKey: "articleId",
  as: "article",
});
Article_Topic.belongsTo(Topic, {
  foreignKey: "topicId",
  as: "topic",
});

// User - Topic (1-n)
User.hasMany(Topic, {
  foreignKey: "approvedById",
});
Topic.belongsTo(User, {
  foreignKey: "approvedById",
  as: "approvedBy",
});

// Article - Profile (n-n)
Article.belongsToMany(Profile, {
  through: Like,
  foreignKey: "articleId",
  as: "articleLikes",
});
Profile.belongsToMany(Article, {
  through: Like,
  foreignKey: "profileId",
  as: "likedArticles",
});
Like.belongsTo(Article, {
  foreignKey: "articleId",
  as: "likedArticle",
});
Like.belongsTo(Profile, {
  foreignKey: "profileId",
  as: "articleLike",
});
Profile.hasMany(Article, {
  foreignKey: "authorId",
});
Article.belongsTo(Profile, {
  foreignKey: "authorId",
  as: "author",
});

// Article - Follow Profile
Article.hasOne(Follow_Profile, {
  sourceKey: "authorId",
  foreignKey: "followedId",
  as: "authorFollowed",
});

// Article - Mute
Article.hasOne(Mute, {
  sourceKey: "authorId",
  foreignKey: "mutedId",
  as: "authorMuted",
});

// Article - Block
Article.hasOne(Block, {
  sourceKey: "authorId",
  foreignKey: "blockedId",
  as: "authorBlocked",
});
Article.hasOne(Block, {
  sourceKey: "authorId",
  foreignKey: "blockerId",
  as: "authorBlocker",
});

// Article - User (n-n)
Report_Article.belongsTo(Article, {
  foreignKey: "articleId",
  as: "article",
});
Report_Article.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
User.hasMany(Report_Article, {
  foreignKey: "resolvedById",
});
Report_Article.belongsTo(User, {
  foreignKey: "resolvedById",
  as: "resolvedBy",
});
User.hasMany(Article, {
  foreignKey: "approvedById",
});
Article.belongsTo(User, {
  foreignKey: "approvedById",
  as: "approvedBy",
});

// Comment - Comment (1-n)
Comment.hasMany(Comment, {
  foreignKey: "parentCommentId",
});
Comment.belongsTo(Comment, {
  foreignKey: "parentCommentId",
  as: "repliesComment",
});

// Comment - Block (1-1)
Comment.hasOne(Block, {
  sourceKey: "authorId",
  foreignKey: "blockedId",
  as: "authorBlocked",
});
Comment.hasOne(Block, {
  sourceKey: "authorId",
  foreignKey: "blockerId",
  as: "authorBlocker",
});

// Commnet - Profile (1-n)
Profile.hasMany(Comment, {
  foreignKey: "authorId",
});
Comment.belongsTo(Profile, {
  foreignKey: "authorId",
  as: "author",
});

// Like - Block (1-1)
Like.hasOne(Block, {
  sourceKey: "profileId",
  foreignKey: "blockedId",
  as: "likerBlocked",
});
Like.hasOne(Block, {
  sourceKey: "profileId",
  foreignKey: "blockerId",
  as: "likerBlocker",
});

// Follow - Block (1-1)
Follow_Profile.hasOne(Block, {
  sourceKey: "followedId",
  foreignKey: "blockedId",
  as: "followedBlocked",
});
Follow_Profile.hasOne(Block, {
  sourceKey: "followedId",
  foreignKey: "blockerId",
  as: "followedBlocker",
});
Follow_Profile.hasOne(Block, {
  sourceKey: "followerId",
  foreignKey: "blockedId",
  as: "followerBlocked",
});
Follow_Profile.hasOne(Block, {
  sourceKey: "followerId",
  foreignKey: "blockerId",
  as: "followerBlocker",
});

// Profile - Block
Profile.hasOne(Block, {
  sourceKey: "id",
  foreignKey: "blockedId",
  as: "profileBlocked",
});
Profile.hasOne(Block, {
  sourceKey: "id",
  foreignKey: "blockerId",
  as: "profileBlocker",
});

// History - Article (n-n)
Article.belongsToMany(Profile, {
  through: Reading_History,
  foreignKey: "articleId",
  as: "readingProfiles",
});
Profile.belongsToMany(Article, {
  through: Reading_History,
  foreignKey: "profileId",
  as: "readArticles",
});
Reading_History.belongsTo(Article, {
  foreignKey: "articleId",
  as: "readArticle",
});
Reading_History.belongsTo(Profile, {
  foreignKey: "profileId",
  as: "readingProfile",
});
