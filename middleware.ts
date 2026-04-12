import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "ptp_user_id";
const ADMIN_SESSION_COOKIE = "ptp_admin_id";

// Routes that require user authentication
const protectedUserRoutes = [
  "/dashboard",
  "/api/submissions",
  "/api/payments",
  "/api/support",
];

// Routes that require admin authentication
const protectedAdminRoutes = [
  "/admin",
];

// Routes that should redirect authenticated users away
const authRoutes = ["/login", "/register", "/auth/verify-email", "/auth/reset-password"];
const adminAuthRoutes = ["/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userSessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const adminSessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isUserAuthenticated = !!userSessionCookie;
  const isAdminAuthenticated = !!adminSessionCookie;

  // Check if accessing protected admin routes
  const isProtectedAdminRoute = protectedAdminRoutes.some(
    (route) => pathname.startsWith(route) && pathname !== "/admin/login"
  );

  // Check if accessing admin auth routes
  const isAdminAuthRoute = adminAuthRoutes.some((route) => pathname === route);

  // Redirect unauthenticated admins from protected admin routes to admin login
  if (isProtectedAdminRoute && !isAdminAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Redirect authenticated admins away from admin login
  if (isAdminAuthRoute && isAdminAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Check if accessing protected user routes
  const isProtectedUserRoute = protectedUserRoutes.some(
    (route) => pathname.startsWith(route) && pathname !== "/api"
  );

  // Check if accessing user auth routes
  const isUserAuthRoute = authRoutes.some((route) => pathname === route);

  // Redirect unauthenticated users from protected routes to login (but not if they're admin)
  if (isProtectedUserRoute && !isUserAuthenticated && !isAdminAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isUserAuthRoute && isUserAuthenticated && !isAdminAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
