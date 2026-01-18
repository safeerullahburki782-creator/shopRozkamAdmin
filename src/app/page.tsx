"use client";

import { useEffect } from "react";
import { LoginForm } from "@/components/Forms/Login";
import { useSession, signOut } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const { data: session } = useSession();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <>
      <Toaster />
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gray-900 p-6 md:p-10">
        <div className="flex w-full max-w-md flex-col gap-6">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
