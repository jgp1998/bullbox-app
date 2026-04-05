import React, { useEffect } from "react";
import { useInitializeRecords } from "@/features/records";
import { useUIStore } from "@/shared/store/useUIStore";

export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { applyTheme } = useUIStore();

  // Subscribe to records globally
  useInitializeRecords();

  // Initial theme apply
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return <>{children}</>;
};

export default AppInitializer;
