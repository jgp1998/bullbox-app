# Authentication Migration Plan

This document outlines the steps to migrate all authentication-related code to the `src/features/auth` directory, following a clean feature-based architecture.

## Current State Analysis
- **Service**: `services/firebase.ts` (initializes Firebase and exports `auth`).
- **Store**: `store/useAuthStore.ts` (Zustand store with Firebase logic).
- **Hook**: `hooks/useAuth.ts` (wrapper around the store).
- **Components**: 
  - `components/auth/LoginScreen.tsx`
  - `components/auth/PasswordResetModal.tsx`
- **Legacy Files**: 
  - `components/LoginScreen.tsx` (Old version, to be removed)
  - `components/PasswordResetModal.tsx` (Old version, to be removed)

## Target Architecture
The authentication feature will be self-contained in `src/features/auth` with the following structure:
- `components/`: UI components (LoginScreen, PasswordResetModal).
- `services/`: Low-level auth services (interacting with Firebase).
- `store/`: State management (Zustand).
- `hooks/`: Custom hooks for the feature.
- `types/`: Domain-specific types.
- `index.ts`: Public API for the feature.

---

## Implementation Checklist

### 1. Types & Domain (Pre-requisite)
- [ ] **Extract Types**: Identify and extract `User` interface from `types.ts` to `src/features/auth/types/index.ts`.
- [ ] **Define Auth State**: Create `AuthState` interface in `src/features/auth/types/index.ts`.

### 2. Services & Firebase Infrastructure
- [ ] **Auth Service Creation**: Create `src/features/auth/services/auth.service.ts`.
  - [ ] Implement `signInWithEmail(email, password)`.
  - [ ] Implement `signOut()`.
  - [ ] Implement `signUpWithEmail(userData, password)`.
  - [ ] Implement `resetUserPassword(email)`.
  - [ ] Implement `subscribeToAuthChanges(callback)`.

### 3. State Management (Zustand)
- [ ] **Auth Store Migration**: Refactor `store/useAuthStore.ts` into `src/features/auth/store/useAuthStore.ts`.
  - [ ] Update to use the newly created `auth.service.ts`.
  - [ ] Ensure initialization logic remains consistent.

### 4. Custom Hooks
- [ ] **useAuth Migration**: Move `hooks/useAuth.ts` to `src/features/auth/hooks/useAuth.ts`.
  - [ ] Update all internal path references.

### 5. UI Components (Interface)
- [ ] **LoginScreen Migration**: Relocate `components/auth/LoginScreen.tsx` to `src/features/auth/components/LoginScreen.tsx`.
  - [ ] Resolve imports for shared UI components (`Button`, `Card`, `Input`).
  - [ ] Resolve i18n context imports.
- [ ] **ResetModal Migration**: Relocate `components/auth/PasswordResetModal.tsx` to `src/features/auth/components/PasswordResetModal.tsx`.
  - [ ] Fix respective imports.

### 6. Public Interface (index.ts)
- [ ] **Export Definitions**: Update `src/features/auth/index.ts` to export:
  - `LoginScreen`
  - `PasswordResetModal`
  - `useAuth`
  - `useAuthStore`
  - `User` type.

### 7. Application Refactoring
- [ ] **Update Imports**: Change all occurrences of `useAuthStore` and `useAuth` from old paths to `@features/auth`.
- [ ] **Root Cleanup**: Remove original files and directories after verification.

---

## Technical Considerations
1. **Shared Firebase Context**: Ensure that `src/shared/services/firebase.ts` remains the main source of initialization to prevent multiple Firebase App instances.
2. **Circular Dependencies**: Watch for cross-feature imports (e.g., Auth needing i18n while Workout needing Auth).
3. **PWA Integration**: Verification needed for `usePWA.ts` as it may rely on authentication status.

---

## Verification Plan
1. [ ] Test **Login Experience** (valid/invalid credentials).
2. [ ] Test **Registration Flow** (new user creation in Firestore).
3. [ ] Test **Password Recovery**.
4. [ ] Test **Persistence** upon page reload.
5. [ ] Test **Logout** functionality.
