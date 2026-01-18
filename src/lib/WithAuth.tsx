"use client";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loaders/Loading";

const WithAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const { isAuthenticated } = useAuth();
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      const hasToken = Cookies.get("accessToken");
      const isLoggedIn = hasToken || (session && status === "authenticated");

      if (status === "loading") return;

      if (!isLoggedIn) {
        router.replace("/");
      }
    }, [isAuthenticated, session, status, router]);

    if (status === "loading") {
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithAuth;
};

export default WithAuth;
