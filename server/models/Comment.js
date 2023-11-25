const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },

    depth: {
      type: Number,
      default: 1,
    },

    content: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CommentSchema.index({ article: 1 });
CommentSchema.index({ createdAt: 1 });
CommentSchema.index({ parentCommentId: 1 });

module.exports = mongoose.model("Comment", CommentSchema);
