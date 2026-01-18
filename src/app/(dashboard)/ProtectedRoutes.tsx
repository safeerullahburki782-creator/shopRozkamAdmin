"use client";
import WithAuth from "@/lib/WithAuth";
import { FC, ReactNode } from "react";

const ProtectedRoutes: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default WithAuth(ProtectedRoutes);
