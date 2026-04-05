import React from "react";
import MainLayout from "@/shared/components/layout/MainLayout";
import GlobalModalContainer from "@/shared/components/layout/GlobalModalContainer";
import AppInitializer from "@/shared/components/AppInitializer";
import Spinner from "@/shared/components/ui/Spinner";
import { useUIStore } from "@/shared/store/useUIStore";
import {
  WorkoutForm,
  useWorkouts,
} from "@/features/workout";
import { WorkoutHistory } from "@/features/history";
import { PersonalBests } from "@/features/records";
import { ShareAndInfo } from "@/features/share";
import { LoginScreen, useAuthStore } from "@/features/auth";
import {
  TrainingAgenda,
  useSchedule,
} from "@/features/schedule";
import { WeightConverter } from "@/features/weight-converter";
import { PercentageCalculator } from "@/features/rm-calculator";

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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Spinner size="xl" label="Cargando BullBox..." />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={() => {}} />;
  }

  return (
    <AppInitializer>
      <MainLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="md:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
            <WorkoutForm onAddRecord={addRecord} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
              <WeightConverter user={user} />
              <PercentageCalculator records={personalBests} user={user} />
            </div>
            <ShareAndInfo />
          </div>
          <div className="md:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
            <PersonalBests
              records={personalBests}
              isLoading={workoutsLoading}
            />
            <TrainingAgenda
              sessions={scheduledSessions}
              onDeleteSession={deleteScheduledSession}
              isLoading={scheduleLoading}
            />
            <WorkoutHistory theme={theme} />
          </div>
        </div>
      </MainLayout>
      <GlobalModalContainer />
    </AppInitializer>
  );
};

export default App;
