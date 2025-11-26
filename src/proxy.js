import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Pages and API accessible only by authenticated users
const protectedRoutes = [
  "/profile",
  "/documents",
  "/documents/create",
];

// Pages not accessible by authenticated users
const authPages = [
  "/signup",
  "/login",
  "/forgot-password",
];

// proxy function
export async function proxy(req) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  let user = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      user = payload;
    } catch (error) {
      console.error("JWT verification failed:", error.message);
    }
  }

  // Redirect unauthenticated users to login page if they try to visit protectedRoutes
  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users to home page if they try to visit authPages
  if (user && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const requestHeaders = new Headers(req.headers);

  if (user) {
    requestHeaders.set("userId", user.id);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
