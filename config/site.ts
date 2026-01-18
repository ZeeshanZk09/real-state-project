export const siteConfig = {
  name: "Zebotix - Web & Business Automation Solutions",
  description:
    "Find your dream property with ease. Buy, sell, and rent properties online.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Properties",
      href: "/Properties",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      auth: true,
      userOnly: false, // Both users and admins can access
    },
    {
      label: "Admin Panel",
      href: "/admin",
      auth: true,
      adminOnly: true,
    },
    {
      label: "Add Property",
      href: "/upload",
      auth: true,
      userOnly: false, // Both users and admins can add properties
    },
    {
      label: "Login",
      href: "/login",
      auth: false,
    },
    {
      label: "Register",
      href: "/register",
      auth: false,
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Properties",
      href: "/Properties",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      auth: true,
      userOnly: false,
    },
    {
      label: "Admin Panel",
      href: "/admin",
      auth: true,
      adminOnly: true,
    },
    {
      label: "My Properties",
      href: "/dashboard/my-properties",
      auth: true,
      userOnly: false,
    },
    {
      label: "Add Property",
      href: "/upload",
      auth: true,
      userOnly: false,
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Privacy",
      href: "/privacy",
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      auth: true,
      userOnly: false,
    },
    {
      label: "Login",
      href: "/login",
      auth: false,
    },
    {
      label: "Register",
      href: "/register",
      auth: false,
    },
  ],
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    docs: "https://nextui.org",
    discord: "https://discord.gg",
    sponsor: "https://patreon.com",
  },
};

export type SiteConfig = typeof siteConfig;
