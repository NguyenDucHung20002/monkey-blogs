import mongoose from "mongoose";
import env from "../../config/env.js";
import ms from "ms";

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    iat: { type: String, required: true },
    exp: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const seconds = ms(env.JWT_REFRESH_EXPIRE_TIME) / 1000;

RefreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: seconds });

export default mongoose.model("refresh-token", RefreshTokenSchema);
