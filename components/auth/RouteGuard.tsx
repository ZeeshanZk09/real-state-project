"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode } from "react";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function RouteGuard({
  children,
  allowedRoles = [],
  redirectTo = "/login",
  requireAuth = true,
}: RouteGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    // Check if authentication is required
    if (requireAuth && !session) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access
    if (session && allowedRoles.length > 0) {
      const userRole = session.user?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect based on user role
        if (userRole === "ADMIN") {
          router.push("/admin");
        } else if (userRole === "USER") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
        return;
      }
    }
  }, [session, status, router, allowedRoles, redirectTo, requireAuth]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render children if user doesn't have access
  if (requireAuth && !session) {
    return null;
  }

  if (session && allowedRoles.length > 0) {
    const userRole = session.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
}
