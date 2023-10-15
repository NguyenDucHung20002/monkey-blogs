const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
    slug: { type: String, require: true, unique: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("Topic", TopicSchema);
