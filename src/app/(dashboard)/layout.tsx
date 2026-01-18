import { FC, ReactNode } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import { ContextProvider } from "@/context/Context";
import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata = {
  title: "Free Earn",
  description: "Free Earn",
};

const Layout: FC<{ children: ReactNode }> = async ({ children }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <ProtectedRoutes>
      <ContextProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <MobileBottomNav />
      </ContextProvider>
    </ProtectedRoutes>
  );
};

export default Layout;
