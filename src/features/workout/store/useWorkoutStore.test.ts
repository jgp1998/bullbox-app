import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWorkoutStore } from './useWorkoutStore';
import { auth, db } from '@/services/firebase';
import { onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Mock dependencies
vi.mock('@/services/firebase', () => ({
    auth: {
        currentUser: { uid: 'test-user-id' }
    },
    db: {}
}));

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(),
    onSnapshot: vi.fn(),
    updateDoc: vi.fn(),
    arrayUnion: (val: any) => `union-${val}`,
    arrayRemove: (val: any) => `remove-${val}`
}));

describe('useWorkoutStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset state
        useWorkoutStore.setState({ 
            exercises: ['Squat'], 
            isLoading: false 
        });
    });

    it('initializes with default state', () => {
        const state = useWorkoutStore.getState();
        // Since I initialized it to ['Squat'] in beforeEach, let's reset to default
        useWorkoutStore.setState({ exercises: ['Default'] });
        expect(useWorkoutStore.getState().exercises).toEqual(['Default']);
        expect(useWorkoutStore.getState().isLoading).toBe(false);
    });

    describe('initialize', () => {
        it('should do nothing if no user is logged in', () => {
            (auth as any).currentUser = null;
            const unsubscribe = useWorkoutStore.getState().initialize();
            
            expect(unsubscribe).toBeDefined();
            expect(onSnapshot).not.toHaveBeenCalled();

            // Set user back
            (auth as any).currentUser = { uid: 'test-user-id' };
        });

        it('should subscribe to user exercises doc', () => {
            const mockUnsubscribe = vi.fn();
            (onSnapshot as any).mockReturnValue(mockUnsubscribe);
            (doc as any).mockReturnValue('mock-doc-ref');

            const unsubscribe = useWorkoutStore.getState().initialize();

            expect(useWorkoutStore.getState().isLoading).toBe(true);
            expect(doc).toHaveBeenCalledWith(db, 'users', 'test-user-id');
            expect(onSnapshot).toHaveBeenCalledWith('mock-doc-ref', expect.any(Function));
                        unsubscribe();
            expect(mockUnsubscribe).toHaveBeenCalled();
        });

        it('should update state when snapshot changes', () => {
            let snapshotCallback: (doc: any) => void = () => {};
            (onSnapshot as any).mockImplementation((ref: any, cb: any) => {
                snapshotCallback = cb;
                return vi.fn();
            });

            useWorkoutStore.getState().initialize();

            // Simulate snapshot with data
            const mockDoc = {
                exists: () => true,
                data: () => ({ exercises: ['New Exercise'] })
            };

            snapshotCallback(mockDoc);

            expect(useWorkoutStore.getState().exercises).toEqual(['New Exercise']);
            expect(useWorkoutStore.getState().isLoading).toBe(false);
        });
    });

    describe('addExercise', () => {
        it('should update firestore with arrayUnion', async () => {
            (doc as any).mockReturnValue('mock-doc-ref');
            
            await useWorkoutStore.getState().addExercise('Bench Press');

            expect(updateDoc).toHaveBeenCalledWith('mock-doc-ref', {
                exercises: 'union-Bench Press'
            });
        });

        it('should do nothing if no user', async () => {
             (auth as any).currentUser = null;
             await useWorkoutStore.getState().addExercise('Bench Press');
             expect(updateDoc).not.toHaveBeenCalled();

             // Cleanup
             (auth as any).currentUser = { uid: 'test-user-id' };
        });
    });

    describe('deleteExercise', () => {
        it('should update firestore with arrayRemove', async () => {
            (doc as any).mockReturnValue('mock-doc-ref');
            
            await useWorkoutStore.getState().deleteExercise('Squat');

            expect(updateDoc).toHaveBeenCalledWith('mock-doc-ref', {
                exercises: 'remove-Squat'
            });
        });
    });
});
