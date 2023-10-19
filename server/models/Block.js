const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

BlockSchema.index({ user: 1, block: 1 });

module.exports = mongoose.model("Block", BlockSchema);
