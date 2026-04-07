import React, { Suspense, lazy } from "react";
import { useAuthStore } from "@/features/auth";
import { useWorkouts } from "@/features/workout";
import { useSchedule, TrainingAgenda } from "@/features/schedule";
import { useUIStore } from "@/shared/store/useUIStore";

// Lazy components for the dashboard
const PersonalBests = lazy(() => import("@/features/records").then(m => ({ default: m.PersonalBests })));
const WorkoutHistory = lazy(() => import("@/features/history").then(m => ({ default: m.WorkoutHistory })));
const ShareAndInfo = lazy(() => import("@/features/share").then(m => ({ default: m.ShareAndInfo })));

const DashboardPage = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const {
    personalBests,
    isLoading: workoutsLoading,
  } = useWorkouts();
  const {
    scheduledSessions,
    deleteScheduledSession,
    isLoading: scheduleLoading,
  } = useSchedule();
  const { theme } = useUIStore();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Personal Bests (Lazy) */}
        <Suspense fallback={<div className="h-64 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
          <PersonalBests
            records={personalBests}
            isLoading={workoutsLoading || authLoading}
          />
        </Suspense>

        {/* Training Agenda (LCP element, not lazy) */}
        <TrainingAgenda
          sessions={scheduledSessions}
          onDeleteSession={deleteScheduledSession}
          isLoading={scheduleLoading || authLoading}
        />
      </div>

      {/* Workout History (Lazy) */}
      <Suspense fallback={<div className="h-96 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
        <WorkoutHistory theme={theme} />
      </Suspense>

      {/* Info section at the bottom */}
      <Suspense fallback={<div className="h-24 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
        <ShareAndInfo />
      </Suspense>
    </div>
  );
};

export default DashboardPage;
