const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ recipient: 1 });
NotificationSchema.index({ createdAt: 1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index(
  { timestamps: 1 },
  { expireAfterSeconds: 2592000, partialFilterExpression: { isRead: true } }
);

module.exports = mongoose.model("Notification", NotificationSchema);
