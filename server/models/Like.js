const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    user: {
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

LikeSchema.index({ user: 1 });
LikeSchema.index({ article: 1 });

module.exports = mongoose.model("Like", LikeSchema);
