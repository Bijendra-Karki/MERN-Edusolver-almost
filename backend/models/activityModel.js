const mongoose = require("mongoose")

// Activity Schema (Knowledge Sharing)
const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Linked to User model
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // users who liked
      },
    ],
    comments: [
      {
        text: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    attachments: [
      {
        fileUrl: { type: String }, // store cloud URL (image, pdf, doc, etc.)
        fileType: { type: String }, // image/pdf/video
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "group", "private"],
      default: "public",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Activity", activitySchema)
