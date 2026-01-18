import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CardBody } from "@heroui/react";

export default async function DashboardPage() {
  const session = await auth();
  console.log("Session:", session);
  if (!session) {
    redirect("/login");
  }

  const dashboardCards = [
    {
      title: "My Properties",
      description: "Manage, edit, and view all your listed properties",
      icon: "🏠",
      href: "/dashboard/my-properties",
      color: "bg-blue-500",
      stats: "Manage your listings",
    },
    {
      title: "Find Agents",
      description: "Connect with experienced real estate agents",
      icon: "👥",
      href: "/dashboard/agents",
      color: "bg-green-500",
      stats: "Browse professionals",
    },
    {
      title: "Account Settings",
      description: "Update your profile and preferences",
      icon: "⚙️",
      href: "/dashboard/settings",
      color: "bg-purple-500",
      stats: "Manage your account",
    },
    {
      title: "Saved Properties",
      description: "View properties you've saved for later",
      icon: "❤️",
      href: "/Properties",
      color: "bg-red-500",
      stats: "Your favorites",
    },
    {
      title: "Upload Property",
      description: "List a new property for sale or rent",
      icon: "📤",
      href: "/upload",
      color: "bg-orange-500",
      stats: "Add new listing",
    },
    {
      title: "Browse Properties",
      description: "Explore all available properties",
      icon: "🔍",
      href: "/Properties",
      color: "bg-indigo-500",
      stats: "Search listings",
    },
  ];

  return (
    <div className="p-6 bg-background">
      <div className="b-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back,{" "}
          {session.user?.firstName || session.user?.name || "User"}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your real estate activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:scale-105 transition-transform duration-200 h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`${card.color} text-white p-3 rounded-lg text-2xl`}
                  >
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {card.description}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.stats}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Properties
          </p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Saved Properties
          </p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Active Inquiries
          </p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Profile Views
          </p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
      </div>
    </div>
  );
}
