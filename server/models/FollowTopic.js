const mongoose = require("mongoose");

const FollowingTopicSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

FollowingTopicSchema.index({ follower: 1 });
FollowingTopicSchema.index({ following: 1 });
FollowingTopicSchema.index({ follower: 1, topic: 1 });

module.exports = mongoose.model("FollowingTopic", FollowingTopicSchema);
