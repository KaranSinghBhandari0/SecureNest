import { NextResponse } from "next/server";

export async function GET() {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

  const googleUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "email profile",
      prompt: "select_account",
    });

  return NextResponse.redirect(googleUrl);
}
