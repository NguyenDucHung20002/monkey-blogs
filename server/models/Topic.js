const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema(
  {
    banner: { type: String, required: true },
    name: { type: String, require: true, unique: true },
    slug: { type: String, require: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Topic", TopicSchema);