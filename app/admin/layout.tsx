import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import RouteGuard from "@/components/auth/RouteGuard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Perform session check
  const session = await auth();

  // If no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Only admins can access admin routes
  if (session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <RouteGuard allowedRoles={["ADMIN"]} requireAuth={true}>
      <main className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <section className="flex-1 flex flex-col">
          <Header />
          <section className="flex-1 p-6">{children}</section>
        </section>
      </main>
    </RouteGuard>
  );
}
