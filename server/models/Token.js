const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    token: { type: String, required: true, unique: true },
    timestamps: { type: Date, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

TokenSchema.index({ timestamps: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Token", TokenSchema);
