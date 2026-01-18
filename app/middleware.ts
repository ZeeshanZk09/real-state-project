import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const userRole = req.auth?.user?.role;

  // Debug logging
  console.log(
    "Middleware - Path:",
    pathname,
    "Logged in:",
    isLoggedIn,
    "Role:",
    userRole,
  );

  // Define route categories
  const publicRoutes = ["/", "/Properties", "/about", "/privacy"];
  const authRoutes = ["/login", "/register"];
  const adminRoutes = ["/admin"];
  const userRoutes = ["/dashboard", "/upload"];
  const apiRoutes = ["/api"];

  // Helper functions
  const isPublicRoute =
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname === "/";
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));
  const isApiRoute = apiRoutes.some((route) => pathname.startsWith(route));
  const isPropertyDetailRoute = /^\/Properties\/[^/]+$/.test(pathname);

  // Allow public routes for everyone
  if (isPublicRoute || isPropertyDetailRoute) {
    return NextResponse.next();
  }

  // Handle API routes separately
  if (isApiRoute) {
    // Allow public API routes
    if (pathname.startsWith("/api/properties") && req.method === "GET") {
      return NextResponse.next();
    }
    // Protect other API routes
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    console.log("Redirecting logged-in user away from auth page");
    const redirectTo = userRole === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, req.nextUrl));
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn && (isAdminRoute || isUserRoute)) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (isLoggedIn) {
    // Admin can access all routes
    if (userRole === "ADMIN") {
      console.log("Admin user - allowing access to all routes");
      return NextResponse.next();
    }

    // Regular users (USER role) can't access admin routes
    if (isAdminRoute && userRole === "USER") {
      console.log(
        "USER role trying to access admin route, redirecting to dashboard",
      );
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // Users with USER role can access user routes
    if (isUserRoute && userRole === "USER") {
      console.log("USER role accessing user route - allowed");
      return NextResponse.next();
    }

    // Only block VISITOR role from user routes (if you have VISITOR role)
    if (isUserRoute && userRole === "VISITOR") {
      console.log(
        "VISITOR role trying to access user route, redirecting to login",
      );
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    String.raw`/((?!_next/static|_next/image|favicon.ico|public|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)/`,
  ],
};
