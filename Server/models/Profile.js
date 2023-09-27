const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avatar: { type: String, required: true, default: "default-avatar.png" },
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String },
    about: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Profile", ProfileSchema);
