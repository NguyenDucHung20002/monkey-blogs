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
import Like from "./Like.js";
import Report_Article from "./Report_Article.js";
import Comment from "./Comment.js";
import Reading_History from "./Reading_History.js";
import Reading_List from "./Reading_List.js";
import Notification from "./notification.js";

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

// Profile - Profile (Mute) (n-n)
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

// Mute - Profile
Mute.belongsTo(Profile, {
  foreignKey: "mutedId",
  as: "muted",
});
Mute.belongsTo(Profile, {
  foreignKey: "muterId",
  as: "muter",
});

// Profile - Profile (Block) (n-n)
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

// Block - Profile
Block.belongsTo(Profile, {
  foreignKey: "blockedId",
  as: "blocked",
});
Block.belongsTo(Profile, {
  foreignKey: "blockerId",
  as: "blocker",
});

// User - User (Ban) (1-n)
User.hasMany(User, {
  foreignKey: "bannedById",
});
User.belongsTo(User, {
  foreignKey: "bannedById",
  as: "bannedBy",
});

// Report - User
Report_User.belongsTo(User, {
  foreignKey: "reportedId",
  as: "reported",
});
Report_User.belongsTo(User, {
  foreignKey: "reporterId",
  as: "reporter",
});

// User - Report (Resolve) (1-n)
User.hasMany(Report_User, {
  foreignKey: "resolvedById",
});
Report_User.belongsTo(User, {
  foreignKey: "resolvedById",
  as: "resolvedBy",
});

// Profile - Profile (Follow) (n-n)
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

// Follow_Profile - Profile
Follow_Profile.belongsTo(Profile, {
  foreignKey: "followedId",
  as: "followed",
});
Follow_Profile.belongsTo(Profile, {
  foreignKey: "followerId",
  as: "follower",
});

// Follow_Profile - Block (1-1)
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

// Profile - Topic (Follow) (n-n)
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

// Follow_Topic - Profile
Follow_Topic.belongsTo(Profile, {
  foreignKey: "profileId",
  as: "profileFollowed",
});

// Follow_Topic - Topic
Follow_Topic.belongsTo(Topic, {
  foreignKey: "topicId",
  as: "topicFollower",
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

// Article_Topic - Article
Article_Topic.belongsTo(Article, {
  foreignKey: "articleId",
  as: "article",
});

// Article_Topic - Topic
Article_Topic.belongsTo(Topic, {
  foreignKey: "topicId",
  as: "topic",
});

// User - Topic (Approve) (1-n)
User.hasMany(Topic, {
  foreignKey: "approvedById",
});
Topic.belongsTo(User, {
  foreignKey: "approvedById",
  as: "approvedBy",
});

// Article - Profile (Like) (n-n)
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

// Like - Article
Like.belongsTo(Article, {
  foreignKey: "articleId",
  as: "likedArticle",
});

// Like - Profile
Like.belongsTo(Profile, {
  foreignKey: "profileId",
  as: "articleLike",
});

// Profile - Article (1-n)
Profile.hasMany(Article, {
  foreignKey: "authorId",
});
Article.belongsTo(Profile, {
  foreignKey: "authorId",
  as: "author",
});

// Article - Follow_Profile
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

// Report_Article - Article
Report_Article.belongsTo(Article, {
  foreignKey: "articleId",
  as: "article",
});

// Report_Article - User
Report_Article.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// User - Report_Article (Resolve) (1-n)
User.hasMany(Report_Article, {
  foreignKey: "resolvedById",
});
Report_Article.belongsTo(User, {
  foreignKey: "resolvedById",
  as: "resolvedBy",
});

// User - Article (Reject) (1-n)
User.hasMany(Article, {
  foreignKey: "rejectedById",
});
Article.belongsTo(User, {
  foreignKey: "rejectedById",
  as: "rejectedBy",
});

// Comment - Comment (Reply) (1-n)
Comment.hasMany(Comment, {
  foreignKey: "parentCommentId",
});
Comment.belongsTo(Comment, {
  foreignKey: "parentCommentId",
  as: "repliesComment",
});

// Comment - Block
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

// Commnet - Profile
Profile.hasMany(Comment, {
  foreignKey: "authorId",
});
Comment.belongsTo(Profile, {
  foreignKey: "authorId",
  as: "author",
});

// Like - Block
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

// Follow_Profile - Block
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

// Article - Profile
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

// Reading_History - Article
Reading_History.belongsTo(Article, {
  foreignKey: "articleId",
  as: "readArticle",
});

// Reading_History - Profile
Reading_History.belongsTo(Profile, {
  foreignKey: "profileId",
  as: "readingProfile",
});

// Reading_List - Article
Reading_List.belongsTo(Article, {
  foreignKey: "articleId",
  as: "readArticle",
});

// Reading_List - Profile
Reading_List.belongsTo(Profile, {
  foreignKey: "profileId",
  as: "readingProfile",
});

// Profile - Block
Profile.hasOne(Block, {
  sourceKey: "id",
  foreignKey: "blockedId",
  as: "blocksBlocked",
});
Profile.hasOne(Block, {
  sourceKey: "id",
  foreignKey: "blockerId",
  as: "blocksBlockedBy",
});

// profile - Follow_Profile
Profile.hasOne(Follow_Profile, {
  sourceKey: "id",
  foreignKey: "followedId",
  as: "followeds",
});

// Notification - Profile
Notification.belongsTo(Profile, {
  foreignKey: "reciverId",
  as: "reciver",
});
Notification.belongsTo(Profile, {
  foreignKey: "senderId",
  as: "sender",
});
