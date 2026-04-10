"use client";

import { createContext, useContext, ReactNode } from "react";

interface StaffContextType {
  role: string;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children, role }: { children: ReactNode; role: string }) {
  return (
    <StaffContext.Provider value={{ role }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
}
