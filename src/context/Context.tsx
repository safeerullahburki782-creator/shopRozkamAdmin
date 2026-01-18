"use client";
import { useAuth } from "@/hooks/useAuth";
import { createContext, useContext, useState, ReactNode } from "react";

// Define context type
interface ContextType {
  token: string;
  showDetails: boolean;
  setShowDetails: (value: boolean) => void;
}

// Create context
const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const { getAccessToken } = useAuth();
  const token: any = getAccessToken();

  const contextValues: ContextType = {
    token,
    showDetails,
    setShowDetails,
  };

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useContextConsumer = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Context must be in Provider");
  }
  return context;
};
