# Workout Feature Migration Plan

This document outlines the steps to migrate all workout-related logic, components, and state to the `src/features/workout` directory.

## Current State Analysis
- **Store**: `store/useWorkoutStore.ts` (Handles records and exercises).
- **Hooks**: 
  - `hooks/useWorkouts.ts` (Simple wrapper)
  - `hooks/useExercises.ts` (Simple wrapper)
- **Components**: 
  - `components/workouts/WorkoutForm.tsx` (Advanced version currently used in App.tsx)
  - `components/workouts/WorkoutHistory.tsx`
  - `components/workouts/PersonalBests.tsx`
  - `components/workouts/ExerciseManagerModal.tsx`
  - `components/WorkoutForm.tsx` (Legacy version in root components)
  - `components/WorkoutHistory.tsx` (Legacy version in root components)
  - `components/PersonalBests.tsx` (Legacy version in root components)
  - `components/ExerciseManagerModal.tsx` (Legacy version in root components)
- **Types**: `types.ts` contains `WorkoutRecord`, `RecordType`, `WeightUnit`.
- **Constants**: `constants.ts` contains `RECORD_TYPES`, `WEIGHT_UNITS`, and initial exercises.

## Target Architecture
- `types/`: Domain-specific types and interfaces.
- `store/`: Zustand state management.
- `hooks/`: Domain-specific hooks.
- `components/`: UI components (Form, History, Bests, Manager).
- `services/`: Any firebase sub-services for workouts.
- `index.ts`: Public API for the feature.

---

## Implementation Checklist
33: 
34: ### 1. Types & Domain
35: - [x] **Extract Types**: Move `WorkoutRecord`, `RecordType`, `WeightUnit` from root `types.ts` to `src/features/workout/types/index.ts`.
36: - [x] **Define Workout State**: Create `WorkoutState` interface in `src/features/workout/types/index.ts`.
37: 
38: ### 2. State & Logic
39: - [x] **Migrate Store**: Move and refactor `store/useWorkoutStore.ts` to `src/features/workout/store/useWorkoutStore.ts`.
40:   - [x] Consolidate exercise and record management.
41:   - [x] Ensure persistence and initialization logic remains intact.
42: - [x] **Migrate Hooks**: Move `hooks/useWorkouts.ts` and `hooks/useExercises.ts` to `src/features/workout/hooks/`.
43:   - [x] Update imports to point to the new store location.
44: 
45: ### 3. UI Components
46: - [x] **Migrate Components**: Move files from `components/workouts/` to `src/features/workout/components/`.
47:   - [x] `WorkoutForm.tsx`
48:   - [x] `WorkoutHistory.tsx`
49:   - [x] `PersonalBests.tsx`
50:   - [x] `ExerciseManagerModal.tsx`
51: - [x] **Resolve Dependencies**: 
52:   - [x] Update imports for `Icons`, `ui/Card`, `ui/Button`, `ui/Input`.
53:   - [x] Update imports for `useI18n` context.
54:   - [x] Update imports for shared types.
55: 
56: ### 4. Constants
57: - [x] **Extract Constants**: Move `RECORD_TYPES`, `WEIGHT_UNITS` and default exercises to `src/features/workout/constants/index.ts` or similar.
58: 
59: ### 5. Integration & Public API
60: - [x] **Export Feature**: Update `src/features/workout/index.ts` to export:
61:   - `WorkoutForm`
62:   - `WorkoutHistory`
63:   - `PersonalBests`
64:   - `ExerciseManagerModal`
65:   - `useWorkoutStore`
66:   - `WorkoutRecord` type.
67: - [x] **Update App.tsx**: Change all workout imports to `@/src/features/workout`.
68: 
69: ### 6. Cleanup
70: - [x] **Delete root components**: Remove `components/workouts/` directory.
71: - [x] **Delete legacy roots**: Remove `components/WorkoutForm.tsx`, `components/WorkoutHistory.tsx`, `components/PersonalBests.tsx`, `components/ExerciseManagerModal.tsx` from `root/components/`.
72: - [x] **Delete root hooks**: Remove `hooks/useWorkouts.ts` and `hooks/useExercises.ts`.
73: - [x] **Delete root store**: Remove `store/useWorkoutStore.ts`.
74: 
75: ---
76: 
77: ## Verification Checklist
78: - [x] Test **Add Record** functionality.
79: - [x] Test **Delete Record**.
80: - [x] Test **Exercise Management** (Add/Delete).
81: - [x] Verify **Personal Bests** calculations (1RM).
82: - [x] Verify **Data Persistence** with Firebase.
