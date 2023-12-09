import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
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

tokenSchema.index({ timestamps: 1 }, { expireAfterSeconds: 259200 });

export default mongoose.model("Token", tokenSchema);
