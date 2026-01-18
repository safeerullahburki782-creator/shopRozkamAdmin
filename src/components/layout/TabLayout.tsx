"use client";

import SidebarNav from "@/components/ProfileSetting/sidebar-tab";
import { Separator } from "@/components/ui/separator";
import {
  CircleHelp,
  Cog,
  Link2,
  List,
  Settings,
  User,
  Wrench,
} from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <div className="p-8">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-4 lg:my-6" />
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="top-0 lg:sticky lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex w-full overflow-y-hidden p-1 pr-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

const sidebarNavItems = [
  {
    title: "Profile",
    icon: <User size={18} />,
    href: "/dashboard/settings",
  },
  {
    title: "System Settings",
    icon: <Settings size={18} />,
    href: "/dashboard/settings/system-settings",
  },
  {
    title: "Marquee",
    icon: <List size={18} />,
    href: "/dashboard/settings/marquee",
  },
  {
    title: "FAQ's",
    icon: <CircleHelp size={18} />,
    href: "/dashboard/settings/faqs",
  },
  {
    title: "Instruction",
    icon: <Wrench size={18} />,
    href: "/dashboard/settings/instructions",
  },
  {
    title: "Domains",
    icon: <Link2 size={18} />,
    href: "/dashboard/settings/domains",
  },
  {
    title: "Category Whatsapp",
    icon: <Link2 size={18} />,
    href: "/dashboard/settings/category-whatsapp",
  },
  {
    title: "Account",
    icon: <Cog size={18} />,
    href: "/dashboard/settings/account",
  },
];
