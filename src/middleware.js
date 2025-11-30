import { NextResponse } from "next/server";
import { verifyToken } from "./helpers/verifyToken";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const { isAdmin, email } = await verifyToken(request);
  const isAuthenticated = !!email;

  if (pathname === "/my-account" && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
