"use client";

import { useSession } from "next-auth/react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { SearchIcon } from "@/components/icons";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import UserButton from "@/components/UserButton";

export const Navbar = () => {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}></Kbd>
      }
      labelPlacement="outside"
      placeholder="Search properties..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  // Filter navigation items based on authentication and role
  const getFilteredNavItems = () => {
    return siteConfig.navItems.filter((item) => {
      // Public items (no auth property)
      if (!("auth" in item)) return true;

      // Auth required items
      if (item.auth) {
        if (!session) return false;

        // Admin-only items
        if (item.adminOnly) {
          return session.user?.role === "ADMIN";
        }

        // User-only items (exclude admins)
        if (item.userOnly) {
          return session.user?.role === "USER";
        }

        // General authenticated items
        return true;
      }

      // Auth not required items (show only when not logged in)
      return !session;
    });
  };

  // Filter mobile menu items
  const getFilteredNavMenuItems = () => {
    return siteConfig.navMenuItems.filter((item) => {
      if (!("auth" in item)) return true;

      if (item.auth) {
        if (!session) return false;

        if (item.adminOnly) {
          return session.user?.role === "ADMIN";
        }

        if (item.userOnly) {
          return session.user?.role === "USER";
        }

        return true;
      }

      return !session;
    });
  };

  if (!mounted) {
    return null;
  }

  const filteredNavItems = getFilteredNavItems();
  const filteredNavMenuItems = getFilteredNavMenuItems();

  return (
    <main className="" suppressHydrationWarning>
      <NextUINavbar maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <p className="font-bold text-inherit text-xl">
                Zebotix - Web & Business Automation Solutions
              </p>
            </NextLink>
          </NavbarBrand>

          <ul className="hidden lg:flex gap-6 justify-center ml-12">
            {filteredNavItems.map((item) => (
              <NavbarItem key={`${item.label}-${item.href}`}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium hover:text-primary transition-colors",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>

          {session ? (
            <NavbarItem>
              <UserButton />
            </NavbarItem>
          ) : (
            <NavbarItem className="flex gap-2">
              <Button as={NextLink} href="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button as={NextLink} href="/register" color="primary" size="sm">
                Register
              </Button>
            </NavbarItem>
          )}

          {!session && (
            <NavbarItem className="hidden md:flex">
              <ThemeSwitch />
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          {!session && <ThemeSwitch />}
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu>
          <div className="mx-4 mt-4">{searchInput}</div>
          <div className="mx-4 mt-4 flex flex-col gap-2">
            {filteredNavMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item.label}-${item.href}-${index}`}>
                <Link
                  color="foreground"
                  href={item.href}
                  size="lg"
                  className="w-full"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}

            {session ? (
              <div className="mt-4 pt-4 border-t border-default-200">
                <UserButton />
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-default-200 space-y-2">
                <Button as={NextLink} href="/login" variant="ghost" fullWidth>
                  Login
                </Button>
                <Button
                  as={NextLink}
                  href="/register"
                  color="primary"
                  fullWidth
                >
                  Register
                </Button>
                <div className="flex justify-center mt-4">
                  <ThemeSwitch />
                </div>
              </div>
            )}
          </div>
        </NavbarMenu>
      </NextUINavbar>
    </main>
  );
};
