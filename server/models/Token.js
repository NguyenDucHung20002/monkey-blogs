const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TokenSchema.index({ token: 1 });
TokenSchema.index({ userId: 1 });
TokenSchema.index({ userId: 1, token: 1 });
TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Token", TokenSchema);
