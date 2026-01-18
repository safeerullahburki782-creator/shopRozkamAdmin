"use client";
import React from "react";
// import { SessionProvider, SessionProviderProps } from "next-auth/react";
import ThemeProvider from "./theme-provider";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </>
  );
}
