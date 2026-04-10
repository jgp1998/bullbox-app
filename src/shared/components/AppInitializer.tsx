import React, { useEffect } from "react";
import { useInitializeRecords } from "@/features/records";
import { useUIStore } from "@/shared/store/useUIStore";
import { webLLMAnalysisRepository } from "@/core/infrastructure";
import { useAIStore } from "@/features/ai/store/useAIStore";
import { useHistoryAnalysisStore } from "@/features/history/store/useHistoryAnalysisStore";

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

  // Background AI Initialization
  useEffect(() => {
    webLLMAnalysisRepository.initialize().catch(err => {
        console.warn("Background AI initialization failed:", err);
    });
  }, []);

  // Network Connectivity Monitoring
  useEffect(() => {
    const handleOnline = () => {
        useAIStore.getState().setOnline(true);
    };
    
    const handleOffline = () => {
        useAIStore.getState().setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    if (!navigator.onLine) {
        handleOffline();
    }

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <>{children}</>;
};

export default AppInitializer;
