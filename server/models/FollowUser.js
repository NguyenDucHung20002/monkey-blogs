const mongoose = require("mongoose");

const FollowUserSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

FollowUserSchema.index({ follower: 1 });
FollowUserSchema.index({ following: 1 });

module.exports = mongoose.model("FollowUser", FollowUserSchema);
