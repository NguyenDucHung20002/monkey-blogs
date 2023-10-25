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
    timestamps: false,
    versionKey: false,
  }
);

FollowingTopicSchema.index({ topic: 1 });
FollowingTopicSchema.index({ follower: 1 });

module.exports = mongoose.model("FollowingTopic", FollowingTopicSchema);
