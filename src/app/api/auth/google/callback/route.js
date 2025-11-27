import axios from "axios";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { cookieOptions } from "@/utils/helper";
import Notification from "@/models/notificationSchema";

export async function GET(req) {
  try {
    await connectDB();

    const code = req.nextUrl.searchParams.get("code");
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

    // 1. Exchange "code" for token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      }
    );

    const { access_token } = tokenRes.data;

    // 2. Get Google user info
    const googleUser = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    const { email, name } = googleUser.data;

    // 3. Check if user exists
    let wasNewUser = false;
    let user = await User.findOne({ email });

    if (!user) {
      wasNewUser = true;
      // Create new Google user
      user = new User({
        username: name,
        email
      });

      await user.save();
    }

    // 4. Generate JWT for session
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 5. Save JWT in cookie & redirect to app
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, cookieOptions);
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/profile`);

    // 6. Send Notification (if user is new)
    if (wasNewUser) {
      Notification.create({
        user: user._id,
        title: "Welcome to SecureNest!",
        message: `Welcome to SecureNest, ${user.username}! We're glad to have you onboard. We recommend you to change your password`,
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Google login failed" }, { status: 500 });
  }
}
