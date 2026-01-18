"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/auth/logout-button";
import {
  LayoutDashboard,
  House,
  PlusCircle,
  Settings,
  MessageSquare,
  User,
  Shield,
} from "lucide-react";
import { Tab } from "./Tab";
import { JSX } from "react";

interface MenuItem {
  name: string;
  link: string;
  icon: JSX.Element;
  roles?: string[];
}

const menuList: MenuItem[] = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "My Properties",
    link: "/dashboard/my-properties",
    icon: <House className="h-5 w-5" />,
  },
  {
    name: "Add Property",
    link: "/upload",
    icon: <PlusCircle className="h-5 w-5" />,
  },
  {
    name: "Inquiries",
    link: "/dashboard/inquiries",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    name: "Profile",
    link: "/dashboard/profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    name: "Admin Panel",
    link: "/admin",
    icon: <Shield className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
  {
    name: "Settings",
    link: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function UserSidebar() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const filteredMenuList = menuList.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole || "");
  });

  return (
    <section className="sticky top-0 flex flex-col gap-10 border-r px-5 py-3 h-screen overflow-hidden w-[260px] z-50 bg-white dark:bg-gray-900">
      <div className="flex justify-center py-4">
        <Link
          href={`/`}
          className="font-bold hover:text-blue-600 transition-colors"
        >
          <h1 className="text-xl">HAMID-HOMES</h1>
        </Link>
      </div>

      {session?.user && (
        <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
            </span>
          </div>
          <div className="text-center">
            <p className="font-medium text-sm">{session.user.name || "User"}</p>
            <p className="text-xs text-gray-500 capitalize">
              {userRole?.toLowerCase()}
            </p>
          </div>
        </div>
      )}

      <ul className="flex-1 h-full overflow-y-auto flex flex-col gap-4">
        {filteredMenuList?.map((item, key) => <Tab item={item} key={key} />)}
      </ul>

      <div className="flex justify-center">
        <div className="flex gap-2 items-center px-3 py-2 rounded-xl w-full justify-center ease-soft-spring duration-400 transition-all">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}
