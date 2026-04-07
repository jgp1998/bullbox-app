import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/shared/components/layout/MainLayout";
import AppInitializer from "@/shared/components/AppInitializer";
import { useAuthStore } from "@/features/auth";

// Lazy pages
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const WorkoutFormPage = lazy(() => import("@/features/workout/WorkoutFormPage"));
const HistoryPage = lazy(() => import("@/features/history/HistoryPage"));
const RecordsPage = lazy(() => import("@/features/records/RecordsPage"));
const WeightConverterPage = lazy(() => import("@/features/weight-converter/WeightConverterPage"));
const RMCalculatorPage = lazy(() => import("@/features/rm-calculator/RMCalculatorPage"));
const LoginScreen = lazy(() => import("@/features/auth").then(m => ({ default: m.LoginScreen })));

// Global components
const GlobalModalContainer = lazy(() => import("@/shared/components/layout/GlobalModalContainer"));

const App = () => {
  const { user, isLoading: authLoading } = useAuthStore();

  // 1. Unauthenticated state
  if (!authLoading && !user) {
    return (
      <Suspense fallback={null}>
        <LoginScreen onLogin={() => {}} />
      </Suspense>
    );
  }

  // 2. Main App Shell with Routing
  return (
    <AppInitializer>
      <MainLayout>
        <Suspense fallback={<div className="h-96 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/entrenar" element={<WorkoutFormPage />} />
            <Route path="/historial" element={<HistoryPage />} />
            <Route path="/marcas" element={<RecordsPage />} />
            <Route path="/conversor" element={<WeightConverterPage />} />
            <Route path="/calculadora" element={<RMCalculatorPage />} />
            
            {/* Fallback to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
      <Suspense fallback={null}>
        <GlobalModalContainer />
      </Suspense>
    </AppInitializer>
  );
};

export default App;
