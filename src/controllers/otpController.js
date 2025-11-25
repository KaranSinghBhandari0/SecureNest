import { errorResponse, successResponse } from "@/utils/responseHelper";
import OTP from "@/models/otpModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/connectDB";
import { trimObject } from "@/utils/trimObject";
import { generateOtpEmail } from "@/utils/mailTemplate";
import { transporter } from "@/lib/transporter";
import { signupValidation } from "@/validations/signupValidation";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import { cookieOptions } from "@/utils/helper";
import Notification from "@/models/notificationSchema";

// SEND OTP
export const sendOtp = async (req) => {
  try {
    await connectDB();
    const { username, email, password } = trimObject(await req.json());

    if (!email) {
      return errorResponse({ message: "Email is required" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await OTP.deleteMany({ email });

    // signup logic
    if (username) {
      const { success, message } = await signupValidation({
        username,
        email,
        password,
      });
      if (!success) {
        return errorResponse({ message });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await OTP.create({
        email,
        otp,
        signupData: {
          username,
          password: hashedPassword,
        },
      });
    }

    // forgot password logic
    else {
      // chechk if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return errorResponse({ message: "User not found with this email" });
      }

      await OTP.create({ email, otp });
    }

    await transporter.sendMail({
      from: `"SecureNest" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: generateOtpEmail(otp, "signup"),
    });

    return successResponse({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return errorResponse({ message: "Failed to send OTP", error: error.message });
  }
};

// VERIFY OTP
export const verifyOtp = async (req) => {
  try {
    const { email, otp } = trimObject(await req.json());

    if (!email || !otp) {
      return errorResponse({ message: "Email and OTP are required" });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return errorResponse({ message: "Invalid or expired OTP" });
    }

    const signupData = otpRecord.signupData;

    // Just verification (e.g., forgot password)
    if (!signupData || !signupData.username || !signupData.password) {
      await OTP.deleteMany({ email });
      return successResponse({ message: "OTP Verification successful" });
    }

    const { username, password } = signupData;

    if (!username || !password) {
      return errorResponse(
        { message: "Signup data incomplete. Please try again." },
        400
      );
    }

    const newUser = await User.create({ username, email, password });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, cookieOptions);
    await OTP.deleteMany({ email });

    Notification.create({
      user: newUser._id,
      title: "Welcome to SecureNest!",
      message: `Welcome to SecureNest, ${newUser.username}! We're glad to have you onboard.`,
    });

    return successResponse(
      { message: "Signup successful", user: newUser },
      200
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return errorResponse(
      { message: "Failed to verify OTP", error: error.message },
      500
    );
  }
};

// RESEND OTP
export const reSendOtp = async (req) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return errorResponse({ message: "Email is required" });
    }

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return errorResponse({ message: "Session timed out. Please sign up again." });
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    otpRecord.otp = newOtp;
    await otpRecord.save();

    await transporter.sendMail({
      from: `"SecureNest" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: generateOtpEmail(newOtp, "resend"),
    });

    return successResponse({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return errorResponse({ message: "Failed to resend OTP", error: error.message }, 500);
  }
};