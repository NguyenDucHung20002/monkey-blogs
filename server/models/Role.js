const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
    slug: { type: String, require: true, unique: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("Role", RoleSchema);
