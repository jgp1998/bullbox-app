import React, { Suspense, lazy } from "react";
import MainLayout from "@/shared/components/layout/MainLayout";
import AppInitializer from "@/shared/components/AppInitializer";
import { useUIStore } from "@/shared/store/useUIStore";
import { useAuthStore } from "@/features/auth";
import { useWorkouts } from "@/features/workout";
import { useSchedule, TrainingAgenda } from "@/features/schedule";

// Lazy components
const GlobalModalContainer = lazy(() => import("@/shared/components/layout/GlobalModalContainer"));
const WorkoutForm = lazy(() => import("@/features/workout").then(m => ({ default: m.WorkoutForm })));
const WorkoutHistory = lazy(() => import("@/features/history").then(m => ({ default: m.WorkoutHistory })));
const PersonalBests = lazy(() => import("@/features/records").then(m => ({ default: m.PersonalBests })));
const ShareAndInfo = lazy(() => import("@/features/share").then(m => ({ default: m.ShareAndInfo })));
const LoginScreen = lazy(() => import("@/features/auth").then(m => ({ default: m.LoginScreen })));
const WeightConverter = lazy(() => import("@/features/weight-converter").then(m => ({ default: m.WeightConverter })));
const PercentageCalculator = lazy(() => import("@/features/rm-calculator").then(m => ({ default: m.PercentageCalculator })));

const App = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const {
    personalBests,
    addRecord,
    isLoading: workoutsLoading,
  } = useWorkouts();
  const {
    scheduledSessions,
    deleteScheduledSession,
    isLoading: scheduleLoading,
  } = useSchedule();

  const { theme } = useUIStore();

  // 1. Unauthenticated state
  if (!authLoading && !user) {
    return (
      <Suspense fallback={null}>
        <LoginScreen onLogin={() => {}} />
      </Suspense>
    );
  }

  // 2. Main App Shell (used for both loading and authenticated states)
  return (
    <AppInitializer>
      <MainLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column (lg:grid-cols-1) */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {authLoading ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="h-72 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />
                <div className="h-48 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />
              </div>
            ) : (
              <>
                <Suspense fallback={<div className="h-72 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
                  <WorkoutForm onAddRecord={addRecord} />
                </Suspense>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
                  <Suspense fallback={<div className="h-48 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
                    <WeightConverter user={user!} />
                  </Suspense>
                  <Suspense fallback={<div className="h-48 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
                    <PercentageCalculator records={personalBests} user={user!} />
                  </Suspense>
                </div>
                
                <Suspense fallback={<div className="h-24 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
                  <ShareAndInfo />
                </Suspense>
              </>
            )}
          </div>

          {/* Right Column (lg:grid-cols-2) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Personal Bests (Lazy) */}
            <Suspense fallback={<div className="h-64 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
              <PersonalBests
                records={personalBests}
                isLoading={workoutsLoading || authLoading}
              />
            </Suspense>

            {/* Training Agenda (NOT LAZY - LCP element) */}
            {/* We don't wrap this in Suspense since it's not lazy, but it has internal loading skeleton */}
            <TrainingAgenda
              sessions={scheduledSessions}
              onDeleteSession={deleteScheduledSession}
              isLoading={scheduleLoading || authLoading}
            />

            {/* Workout History (Lazy) */}
            <Suspense fallback={<div className="h-96 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
              <WorkoutHistory theme={theme} />
            </Suspense>
          </div>
        </div>
      </MainLayout>
      <Suspense fallback={null}>
        <GlobalModalContainer />
      </Suspense>
    </AppInitializer>
  );
};

export default App;
