"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const token = Cookies.get("accessToken") || session?.accessToken;

    if (token) {
      setIsAuthenticated(true);
      if (!Cookies.get("accessToken")) {
        Cookies.set("accessToken", token, { expires: 8 });
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [session, status]);

  const getAccessToken = () => {
    return Cookies.get("accessToken") || session?.accessToken;
  };

  const loginAuth = (token: string, refreshToken: string) => {
    Cookies.set("accessToken", token, { expires: 8 });
    Cookies.set("refreshToken", refreshToken, { expires: 7 });
    setIsAuthenticated(true);
    router.push("/dashboard/overiew");
  };

  const logout = async () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsAuthenticated(false);
    await signOut({ callbackUrl: "/" });
  };

  return {
    isAuthenticated,
    loginAuth,
    logout,
    getAccessToken,
  };
};
