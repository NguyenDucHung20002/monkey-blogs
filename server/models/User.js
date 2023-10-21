const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    avatar: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String },
    about: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    status: { type: String, required: true, default: "active" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.index();

module.exports = mongoose.model("User", UserSchema);
