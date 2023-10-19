const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img: { type: String, required: true },
    title: { type: String, required: true },
    preview: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    status: { type: String, required: true, default: "approved" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Article", ArticleSchema);
