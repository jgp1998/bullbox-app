import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/shared/components/layout/MainLayout";
import AppInitializer from "@/shared/components/AppInitializer";
import { useAuthStore } from "@/features/auth";
import ReloadPrompt from "@/shared/components/pwa/ReloadPrompt";


// Lazy pages
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const WorkoutFormPage = lazy(() => import("@/features/workout/WorkoutFormPage"));
const HistoryPage = lazy(() => import("@/features/history/HistoryPage"));
const RecordsPage = lazy(() => import("@/features/records/RecordsPage"));
const WeightConverterPage = lazy(() => import("@/features/weight-converter/WeightConverterPage"));
const RMCalculatorPage = lazy(() => import("@/features/rm-calculator/RMCalculatorPage"));
const LoginScreen = lazy(() => import("@/features/auth").then(m => ({ default: m.LoginScreen })));
const FeedbackPage = lazy(() => import("@/features/feedback").then(m => ({ default: m.FeedbackPage })));

// Global components
const GlobalModalContainer = lazy(() => import("@/shared/components/layout/GlobalModalContainer"));

const App = () => {
  const { user, isLoading: authLoading } = useAuthStore();

  // 0. Initial Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--background)">
        <Suspense fallback={null}>
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-3xl font-black text-(--primary) tracking-tighter uppercase italic animate-pulse">
              BULL<span className="text-(--text)">BOX</span>
            </h1>
            <div className="w-12 h-12 border-4 border-(--primary)/20 border-t-(--primary) rounded-full animate-spin" />
          </div>
        </Suspense>
      </div>
    );
  }

  // 1. Unauthenticated state
  if (!user) {
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
            <Route path="/feedback" element={<FeedbackPage />} />
            
            {/* Fallback to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
      <Suspense fallback={null}>
        <GlobalModalContainer />
      </Suspense>
      <ReloadPrompt />
    </AppInitializer>
  );
};

export default App;
