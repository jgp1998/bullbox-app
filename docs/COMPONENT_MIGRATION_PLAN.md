# Component Migration Plan - Featured Components

This plan outlines the relocation of remaining components from `components/` and its subdirectories to the modular `src/features/` and `src/shared/` architecture, following the "featured component" pattern.

## 📁 Source & Destination Mapping

### 1. Global & Shared Components
These components provide foundational UI elements and layout structures used across multiple features.

| Source | Target Destination | Notes |
| :--- | :--- | :--- |
| `components/ui/Alert.tsx` | `src/shared/components/ui/Alert.tsx` | Shared UI |
| `components/ui/Button.tsx` | `src/shared/components/ui/Button.tsx` | Shared UI |
| `components/ui/Card.tsx` | `src/shared/components/ui/Card.tsx` | Shared UI |
| `components/ui/Input.tsx` | `src/shared/components/ui/Input.tsx` | Shared UI |
| `components/ui/Modal.tsx` | `src/shared/components/ui/Modal.tsx` | Shared UI |
| `components/ui/Spinner.tsx` | `src/shared/components/ui/Spinner.tsx` | Shared UI |
| `components/Header.tsx` | `src/shared/components/layout/Header.tsx` | Application Header |
| `components/Icons.tsx` | `src/shared/components/ui/Icons.tsx` | SVG Icon Library |

### 2. Feature-Specific Components
These components belong to a specific domain and should be encapsulated within their respective feature modules.

| Source | Target Destination | Domain Feature |
| :--- | :--- | :--- |
| `components/admin/AdminPanel.tsx` | `src/features/admin/components/AdminPanel.tsx` | **admin** |
| `components/analysis/ExerciseDetailModal.tsx` | `src/features/workout/components/ExerciseDetailModal.tsx` | **workout** (Encyclopedia/Analysis) |
| `components/schedule/ScheduleModal.tsx` | `src/features/schedule/components/ScheduleModal.tsx` | **schedule** |
| `components/schedule/TrainingAgenda.tsx` | `src/features/schedule/components/TrainingAgenda.tsx` | **schedule** |
| `components/schedule/TrainingSchedule.tsx` | `src/features/schedule/components/TrainingSchedule.tsx` | **schedule** |
| `components/schedule/UpcomingEvents.tsx` | `src/features/schedule/components/UpcomingEvents.tsx` | **schedule** |
| `components/ui/ShareAndInfo.tsx` | `src/features/share/components/ShareAndInfo.tsx` | **share** |
| `components/ui/UserTour.tsx` | `src/features/pwa/components/UserTour.tsx` | **pwa** (Onboarding/PWA utility) |

---

## 🛠 Implementation Steps

### Phase 1: Create Directories
Ensure target directories exist for new features and shared components.
- [ ] Create `src/features/admin/components`
- [ ] Create `src/features/schedule/components`
- [ ] Create `src/shared/components/ui`
- [ ] Create `src/shared/components/layout`

### Phase 2: Relocate Components
Move files to their new modular locations.
- [ ] Move **admin panel**
- [ ] Move **schedule** components
- [ ] Move **shared UI** components
- [ ] Move **analysis modal** to workout feature
- [ ] Move **onboarding/tour** to PWA feature
- [ ] Move **share info** to share feature

### Phase 3: Import & Path Refactoring
Update relative imports in the moved components:
- [ ] Update `import { ... } from '../../types'` to `@/types` or `@/core/domain/types`.
- [ ] Update `import { ... } from '../Icons'` to `@/shared/components/ui/Icons`.
- [ ] Update `import { ... } from '../ui/...'` to `@/shared/components/ui/...`.
- [ ] Use path aliases `@/shared/...` and `@/features/...` everywhere.

### Phase 4: Cleanup
- [ ] Remove redundant/duplicate files from root `components/` (e.g., `AdminPanel.tsx`, `UpcomingEvents.tsx` which also exist in subfolders).
- [ ] Final check for any broken imports in main `App.tsx` or other components.

## ✅ Verification
- [ ] Ensure all components correctly display their new modular location in React DevTools.
- [ ] Verify that shared components are correctly aliased.
- [ ] Run `npm start/dev` to confirm no compilation errors.
