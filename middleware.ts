import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const session = request.cookies.get("session");
  // const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  // if (!session && !isAuthPage) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // if (session && isAuthPage) {
  //   return NextResponse.redirect(new URL("/chat", request.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/login"],
}; 