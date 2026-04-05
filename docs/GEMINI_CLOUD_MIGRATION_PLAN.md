# Migration Plan: Gemini AI to Firebase Functions

This plan outlines the steps required to migrate the Gemini AI analysis integration from the client-side (frontend) to have it executed securely in the cloud via **Firebase Functions**. 

## 🎯 Objectives
- **Security**: Hide the `API_KEY` from public exposure in the client side.
- **Maintainability**: Centralize AI prompt logic in the backend.
- **Efficiency**: Move heavy computation or formatting logic away from the client.
- **Compliance**: Adhere to best practices for production AI integrations.

---

## 🛠 Required Tools & Services
- **Firebase CLI**: For initializing and deploying functions.
- **Firebase Functions**: (Blaze Plan required for outbound network requests to Gemini API).
- **Google AI SDK for Node.js**: `@google/genai` on the server side.
- **Firebase Secrets Manager**: For secure storing of the `API_KEY`.

---

## 📋 Implementation Steps

### Phase 1: Infrastructure Setup
1. [x] **Initialize Firebase Functions**:
   - Run `firebase init functions` in the project root. (DONE)
   - Select **TypeScript** as the language. (DONE)
   - Use `npm` for dependency management. (DONE)
2. [x] **Install Backend Dependencies**:
   - Inside the `./functions` directory, run:
     ```bash
     npm install @google/generative-ai firebase-functions firebase-admin
     ``` (DONE)
3. [x] **Configure Secret Manager**:
   - Register the Gemini API key in Firebase Secrets:
     ```bash
     firebase functions:secrets:set GEMINI_API_KEY
     ``` (DONE)

### Phase 2: Cloud Function Implementation
1. [x] **Create Analysis Function (`onCall`)**:
   - Create a callable function `getTrainingAdvice` that receives `record` and `history`. (DONE in `functions/src/index.ts`)
2. [x] **Create Exercise Details Function (`onCall`)**:
   - Create a callable function `getExerciseDetails` that receives `exerciseName`. (DONE in `functions/src/index.ts`)
3. [x] **Add Middleware/Validation**:
   - Ensure only authenticated users can call these functions using `request.auth`. (DONE)
   - Handle timeout and error scenarios specifically for the Gemini API. (DONE)

### Phase 3: Frontend Refactoring
1. [x] **Remove Frontend Dependency**:
   - Remove `@google/genai` from `package.json` in the frontend. (DONE)
2. [x] **Update `historyAnalysis.service.ts`**:
   - Replace the direct Gemini API call with `httpsCallable` from Firebase Functions SDK. (DONE in `src/features/history/services/historyAnalysis.service.ts`)
3. [x] **Update Environment Variables**:
   - Remove `VITE_GEMINI_API_KEY` (or equivalent) from frontend `.env` files. (DONE)
   - Extra: Removed `define` process env in `vite.config.ts`. (DONE)

### Phase 4: Testing & Deployment
1. [ ] **Local Emulator Testing**:
   - Use `firebase emulators:start` to verify the functions locally. (PENDING)
   - Update frontend to point to the local functions emulator. (PENDING)
2. [ ] **Deployment**:
   - Run `firebase deploy --only functions`. (PENDING)
   - Verify in production that AI results are still being generated without keys in the browser console. (PENDING)

---

## 📈 Next Steps
- [x] Confirm the Firebase Project matches the intended environment for Functions. (jornlift)
- [x] Verify if there are any specific rate-limiting or caching requirements for the backend.
- [x] Start Phase 1 by initializing the `functions` directory.
- [ ] Set `GEMINI_API_KEY` secret.
- [ ] Run Local Emulator to test end-to-end.
- [ ] Deploy to Production.
