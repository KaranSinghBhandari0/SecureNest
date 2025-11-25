import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { sendOtp } from "./otpController";
import User from "@/models/userModel";
import { connectDB } from "@/lib/connectDB";
import { cookies } from "next/headers";
import { cookieOptions } from "@/utils/helper";
import { isWeak } from "@/validations/signupValidation";
import Notification from "@/models/notificationSchema";
import Document from "@/models/docModel";

// SIGNUP
export async function signup(req) {
  try {
    return sendOtp(req);
  } catch (error) {
    console.error("Signup Error:", error);
    return errorResponse(
      { message: "Server error", error: error.message },
      500
    );
  }
}

// CHECK AUTHENTICATION
export const getCurrentUser = async () => {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) return null;

    const user = await User.findById(decoded.id).lean();

    return JSON.parse(JSON.stringify(user)) || null;
  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}

// LOGIN
export const login = async (req) => {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return errorResponse({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, cookieOptions);

    const { password: _, ...safeUser } = user._doc;

    return successResponse({ message: "Login successful", user: safeUser });
  } catch (error) {
    console.error("Login Error:", error);
    return errorResponse({ message: "Server error", error: error.message });
  }
}

// LOGOUT
export const logout = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse({ message: "Server error", error: error.message });
  }
}

// RESET PASSWORD
export async function resetPassword(req) {
  try {
    await connectDB();

    let { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return errorResponse({ message: "Email and new password are required" }, 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse({ message: "No user is registered with this email" }, 404);
    }

    newPassword = newPassword.trim();
    if (isWeak(newPassword)) {
      return errorResponse({ message: "Password is too weak" }, 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    Notification.create({
      user: user._id,
      title: "Password Changed",
      message: "Your password has been changed successfully.",
    });

    return successResponse(
      { message: "Password changed successfully" },
      200
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return errorResponse(
      { message: "Failed to reset password", error: error.message },
      500
    );
  }
}

// DELETE ACCOUNT
export const deleteAccount = async (req) => {
  try {
    await connectDB();

    const userId = req.headers.get("userId");
    const user = await User.findById(userId);

    if (!user) {
      return errorResponse({ message: "User not found" });
    }

    await logout();
    await User.findByIdAndDelete(userId);
    await Notification.deleteMany({ user: userId });
    await Document.deleteMany({ user: userId });

    return successResponse({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return errorResponse({ message: "Failed to delete account", error: error.message });
  }
}