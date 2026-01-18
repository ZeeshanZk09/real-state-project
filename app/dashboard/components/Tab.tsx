"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";

interface MenuItem {
  name: string;
  link: string;
  icon: JSX.Element;
}

interface TabProps {
  item: MenuItem;
}

export function Tab({ item }: TabProps) {
  const pathname = usePathname();
  const isActive =
    pathname === item.link || pathname.startsWith(item.link + "/");

  return (
    <li>
      <Link
        href={item.link}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-blue-500 text-white shadow-md"
            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        }`}
      >
        {item.icon}
        <span className="font-medium">{item.name}</span>
      </Link>
    </li>
  );
}
