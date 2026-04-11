import React, { Suspense, lazy } from "react";
import { useAuthStore } from "@/features/auth";
import { useWorkouts } from "@/features/workout";
import { useSchedule, TrainingAgenda } from "@/features/schedule";
import { useUIStore } from "@/shared/store/useUIStore";
import { useI18n } from "@/shared/context/i18n";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/Button";
import { BrainCircuitIcon } from "@/shared/components/ui/Icons";

// Lazy components for the dashboard
const PersonalBests = lazy(() =>
  import("@/features/records").then((m) => ({ default: m.PersonalBests })),
);
const WorkoutHistory = lazy(() =>
  import("@/features/history").then((m) => ({ default: m.WorkoutHistory })),
);
const ShareAndInfo = lazy(() =>
  import("@/features/share").then((m) => ({ default: m.ShareAndInfo })),
);

const DashboardPage = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const { t } = useI18n();
  const { personalBests, isLoading: workoutsLoading } = useWorkouts();
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
        <Suspense
          fallback={
            <div className="h-64 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />
          }
        >
          <PersonalBests
            records={personalBests}
            isLoading={workoutsLoading || authLoading}
            showAiAnalysis={false}
          />
        </Suspense>

        {/* Training Agenda (LCP element, not lazy) */}
        <TrainingAgenda
          sessions={scheduledSessions}
          onDeleteSession={deleteScheduledSession}
          isLoading={scheduleLoading || authLoading}
        />
      </div>

      {/* AI Coach Insight - HIDDEN FOR LATER LAUNCH
      <Card className="bg-linear-to-br from-(--primary)/20 to-transparent border-(--primary)/30 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
           <BrainCircuitIcon className="w-32 h-32 text-(--primary)" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 p-2">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-(--primary) mb-2">{t('dashboard.aiCoach')}</h3>
            <p className="text-sm font-medium text-(--text) max-w-md">
              {t('dashboard.aiCoachDescription')}
            </p>
          </div>
          <Button 
            variant="primary" 
            className="shadow-lg shadow-(--primary)/20 whitespace-nowrap"
            onClick={() => {
              // Open history to get analysis if needed, or just show a modal
              const historyTab = document.querySelector('[data-tab="history"]') as HTMLElement;
              if (historyTab) historyTab.click();
            }}
          >
            {t('dashboard.seeAnalysis')}
          </Button>
        </div>
      </Card>
      */}

      {/* Workout History (Lazy) */}
      <Suspense fallback={<div className="h-96 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
        <WorkoutHistory theme={theme} showAiAnalysis={false} />
      </Suspense>

      {/* Info section at the bottom */}
      <Suspense
        fallback={
          <div className="h-24 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />
        }
      >
        <ShareAndInfo />
      </Suspense>
    </div>
  );
};

export default DashboardPage;
