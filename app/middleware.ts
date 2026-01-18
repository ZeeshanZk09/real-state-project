import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const userRole = req.auth?.user?.role;

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
      return NextResponse.next();
    }

    // Regular users can't access admin routes
    if (isAdminRoute && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // Users must be at least USER role to access user routes
    if (isUserRoute && userRole === "VISITOR") {
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
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
