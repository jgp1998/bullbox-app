import React, { Suspense } from "react";
import { useWorkouts } from "@/features/workout";
import { WorkoutForm } from "@/features/workout";

const WorkoutFormPage = () => {
  const { addRecord } = useWorkouts();

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-bold text-(--foreground) mb-4">Registrar Entrenamiento</h1>
      <Suspense fallback={<div className="h-72 bg-(--card) rounded-3xl animate-pulse border border-(--border)" />}>
        <WorkoutForm onAddRecord={addRecord} />
      </Suspense>
    </div>
  );
};

export default WorkoutFormPage;
