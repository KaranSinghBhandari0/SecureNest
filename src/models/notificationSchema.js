import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only track createdAt
  }
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
export default Notification;