const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    loginType: { type: String, required: true },
    status: { type: String, required: true, default: "active" },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", UserSchema);
