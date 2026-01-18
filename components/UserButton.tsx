"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
  Divider,
} from "@nextui-org/react";
import {
  User,
  Settings,
  LayoutDashboard,
  Shield,
  House,
  PlusCircle,
  MessageSquare,
  Palette,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";

interface UserMenuItem {
  key: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  description?: string;
  divider?: boolean;
  action?: () => void;
  roles?: string[];
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

export default function UserButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) {
    return null;
  }

  const userRole = session.user?.role;
  const userName = session.user?.name || "User";
  const userEmail = session.user?.email || "";
  const userAvatar = session.user?.image;
console.log("session: ", session)
  // Define menu items based on user role
  const getMenuItems = (): UserMenuItem[] => {
    const baseItems: UserMenuItem[] = [
      {
        key: "profile",
        label: "Profile",
        href: "/dashboard/settings",
        icon: <User className="w-4 h-4" />,
        description: "Manage your account settings",
      },
      {
        key: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
        description: "View your dashboard",
      },
      {
        key: "my-properties",
        label: "My Properties",
        href: "/dashboard/my-properties",
        icon: <House className="w-4 h-4" />,
        description: "Manage your property listings",
      },
      {
        key: "add-property",
        label: "Add Property",
        href: "/upload",
        icon: <PlusCircle className="w-4 h-4" />,
        description: "List a new property",
      },
      {
        key: "inquiries",
        label: "Inquiries",
        href: "/dashboard/inquiries",
        icon: <MessageSquare className="w-4 h-4" />,
        description: "View property inquiries",
      },
    ];

    // Add admin-specific items
    if (userRole === "ADMIN") {
      baseItems.push({
        key: "admin-panel",
        label: "Admin Panel",
        href: "/admin",
        icon: <Shield className="w-4 h-4" />,
        description: "Access admin features",
        color: "danger" as const,
        divider: true,
      });
    }

    // Add theme toggle
    baseItems.push(
      {
        key: "divider-1",
        label: "",
        icon: <></>,
        divider: true,
      },
      {
        key: "theme",
        label: theme === "dark" ? "Light Mode" : "Dark Mode",
        icon:
          theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          ),
        description: "Toggle theme",
        action: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
      {
        key: "settings",
        label: "Settings",
        href: "/dashboard/settings",
        icon: <Settings className="w-4 h-4" />,
        description: "Account preferences",
      },
      {
        key: "divider-2",
        label: "",
        icon: <></>,
        divider: true,
      },
      {
        key: "logout",
        label: "Sign Out",
        icon: <LogOut className="w-4 h-4" />,
        color: "danger" as const,
        action: () => signOut(),
      },
    );

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleItemClick = (item: UserMenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
    setIsOpen(false);
  };

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="light"
          className="p-0 data-[hover=true]:bg-transparent"
          disableRipple
        >
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-default-100 transition-colors">
            <Avatar
              src={userAvatar || undefined}
              name={userName.charAt(0)}
              size="sm"
              className="w-8 h-8"
            />
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium leading-none">
                {userName}
              </span>
              <span className="text-xs text-default-500 capitalize leading-none mt-0.5">
                {userRole?.toLowerCase()}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-default-400 ml-1" />
          </div>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="User menu"
        className="w-[280px]"
        itemClasses={{
          base: "gap-4 p-3",
        }}
      >
        {/* User Info Header */}
        <DropdownItem
          key="user-info"
          className="h-auto opacity-100 cursor-default"
          textValue="User info"
        >
          <div className="flex items-center gap-3">
            <Avatar
              src={userAvatar || undefined}
              name={userName.charAt(0)}
              size="md"
              className="w-10 h-10"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-small">{userName}</span>
              <span className="text-tiny text-default-500">{userEmail}</span>
              <span className="text-tiny text-primary capitalize font-medium">
                {userRole?.toLowerCase()} account
              </span>
            </div>
          </div>
        </DropdownItem>

        {/* Menu Items */}
        {menuItems.map((item) => {
          if (item.divider) {
            return (
              <DropdownItem
                key={item.key}
                className="p-0 m-0"
                textValue={item.key}
              >
                <Divider className="my-1" />
              </DropdownItem>
            );
          }

          return (
            <DropdownItem
              key={item.key}
              startContent={item.icon}
              description={item.description}
              color={item.color}
              className="text-default-700 data-[hover=true]:text-foreground"
              onClick={() => handleItemClick(item)}
              textValue={item.label}
            >
              <span className="font-medium">{item.label}</span>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
