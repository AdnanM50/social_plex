import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access-token")?.value
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ["/login", "/signup", "/verify-otp"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If user is authenticated and trying to access auth pages, redirect to profile
  if (token && isPublicRoute) {
    // We can't get user ID from middleware, so redirect to feed for now
    // The profile redirect will happen from the login page itself
    return NextResponse.redirect(new URL("/feed", request.url))
  }

  // If user is not authenticated and trying to access protected pages, redirect to login
  if (!token && !isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
