const mongoose = require("mongoose");

const Notify = new mongoose.Schema(
  {
    sender:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type:{
      type: String,
      required:true,
    },
    slugArticle:{
      type:String,
      // ref:"Article",
      required:true,
    },
    avatarSender: {
      type: String,
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

module.exports = mongoose.model("Notify", Notify);