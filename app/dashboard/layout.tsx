import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import UserSidebar from "./components/UserSidebar";
import RouteGuard from "@/components/auth/RouteGuard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Only allow USER and ADMIN roles to access dashboard
  if (session.user?.role === "VISITOR") {
    redirect("/login");
  }

  return (
    <RouteGuard allowedRoles={["USER", "ADMIN"]} requireAuth={true}>
      <main className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <UserSidebar />
        </div>
        <section className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome back, {session.user?.name || "User"}!
            </h2>
            <p className="text-sm text-gray-600">
              Manage your properties and inquiries
            </p>
          </header>
          <section className="flex-1 p-6">{children}</section>
        </section>
      </main>
    </RouteGuard>
  );
}
