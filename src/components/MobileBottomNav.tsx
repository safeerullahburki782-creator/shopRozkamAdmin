"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mail, MessageCircleMore, PanelTopOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const bottomNavItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard/overiew",
  },
  {
    title: "Emails",
    icon: Mail,
    url: "/dashboard/emails",
  },
  {
    title: "Withdrawls",
    icon: PanelTopOpen,
    url: "/dashboard/withdrawls",
  },
  {
    title: "Chat",
    icon: MessageCircleMore,
    url: "/dashboard/chat",
  },
];

const MobileBottomNav = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    isMobile && (
      <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-around border-t bg-white shadow-md">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.url;

          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex flex-col items-center justify-center p-2 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-gray-500 hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    )
  );
};

export default MobileBottomNav;
