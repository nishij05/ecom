// middleware.js

import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.headers.get("authorization")?.split(" ")[1];

  // Define protected paths
  const protectedPaths = ["/profile"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Define paths where this middleware runs
export const config = {
  matcher: ["/profile"],
};
