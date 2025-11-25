import { connectDB } from "@/lib/connectDB";
import Notification from "@/models/notificationSchema";
import { errorResponse, successResponse } from "@/utils/responseHelper";

export const getNotifications = async (userId) => {
  try {
    await connectDB();

    if (!userId) {
      return [];
    }

    const userNotifications = await Notification.find({
      user: userId,
    }).sort({ createdAt: -1 }).lean();

    return JSON.parse(JSON.stringify(userNotifications)) || null;
  } catch (error) {
    console.error("Error getting notifications:", error);
    return errorResponse(
      { message: "Failed to get notifications", error: error.message },
      500
    );
  }
};

export const markAllAsRead = async (req) => {
  try {
    await connectDB();
    
    const userId = req.headers.get("userId"); 
    if (!userId) {
      return errorResponse(
        { message: "User ID missing in request headers" },
        400
      );
    }

    await Notification.updateMany(
      { user: userId, status: "unread" },
      { $set: { status: "read" } }
    );

    return successResponse(
      { message: "All notifications marked as read" },
      200
    );
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return errorResponse(
      { message: "Failed to mark notifications as read", error: error.message },
      500
    );
  }
};
