const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    avatar: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String },
    about: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    status: { type: String, default: "normal" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.index({ status: 1 });
UserSchema.index({ fullname: "text", username: "text" });

module.exports = mongoose.model("User", UserSchema);
