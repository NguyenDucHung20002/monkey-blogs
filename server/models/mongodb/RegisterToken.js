import mongoose from "mongoose";

const registerTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

registerTokenSchema.index({ timestamps: 1 }, { expireAfterSeconds: 900 });

export default mongoose.model("Register-Token", registerTokenSchema);
