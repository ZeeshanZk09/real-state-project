"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/auth/logout-button";
import {
  Layers2,
  Settings,
  LayoutDashboard,
  House,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  User,
} from "lucide-react";
import { Tab } from "./Tab";
import { JSX } from "react";

interface MenuItem {
  name: string;
  link: string;
  icon: JSX.Element;
  divider?: boolean;
}

const menuList: MenuItem[] = [
  {
    name: "Admin Dashboard",
    link: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Manage Properties",
    link: "/admin/properties",
    icon: <House className="h-5 w-5" />,
  },
  {
    name: "Manage Users",
    link: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "Inquiries",
    link: "/admin/inquiries",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    name: "Analytics",
    link: "/admin/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    name: "Add Property",
    link: "/admin/Addproperties",
    icon: <Layers2 className="h-5 w-5" />,
    divider: true,
  },
  {
    name: "User Dashboard",
    link: "/dashboard",
    icon: <User className="h-5 w-5" />,
  },
  {
    name: "Settings",
    link: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <section className="sticky top-0 flex flex-col gap-10 border-r px-5 py-3 h-screen overflow-hidden w-[260px] z-50 bg-white dark:bg-gray-900">
      <div className="flex justify-center py-4">
        <Link
          href={`/`}
          className="font-bold hover:text-blue-600 transition-colors"
        >
          <h1 className="text-xl">ZEBOTIX WBAS</h1>
        </Link>
      </div>

      {session?.user && (
        <div className="flex flex-col items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <p className="font-medium text-sm">
              {session.user.name || "Admin"}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase">
              Administrator
            </p>
          </div>
        </div>
      )}

      <ul className="flex-1 h-full overflow-y-auto flex flex-col gap-1">
        {menuList?.map((item, key) => (
          <div key={key}>
            <Tab item={item} />
            {item.divider && (
              <hr className="my-3 border-gray-200 dark:border-gray-700" />
            )}
          </div>
        ))}
      </ul>

      <div className="flex justify-center">
        <div className="flex gap-2 items-center px-3 py-2 rounded-xl w-full justify-center ease-soft-spring duration-400 transition-all">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}
