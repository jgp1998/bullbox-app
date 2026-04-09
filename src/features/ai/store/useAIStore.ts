import { create } from 'zustand';
import { InitProgressReport } from "@mlc-ai/web-llm";

export type EngineStatus = 'uninitialized' | 'loading' | 'ready' | 'error';

interface AIState {
    engineStatus: EngineStatus;
    progress: number;
    progressText: string;
    isWebGPUSupported: boolean | null;
    isStoragePersisted: boolean;
    isOnline: boolean;
    error: string | null;
    
    // Actions
    setProgress: (report: InitProgressReport) => void;
    setEngineStatus: (status: EngineStatus) => void;
    setOnline: (isOnline: boolean) => void;
    setError: (error: string | null) => void;
    setStoragePersisted: (isPersisted: boolean) => void;
    checkWebGPUSupport: () => Promise<boolean>;
}

export const useAIStore = create<AIState>((set) => ({
    engineStatus: 'uninitialized',
    progress: 0,
    progressText: '',
    isWebGPUSupported: null,
    isStoragePersisted: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    error: null,
    
    setProgress: (report) => set({ 
        progress: report.progress, 
        progressText: report.text 
    }),
    
    setEngineStatus: (status) => set({ engineStatus: status }),

    setOnline: (isOnline) => set({ isOnline }),
    
    setError: (error) => set({ error, engineStatus: error ? 'error' : 'uninitialized' }),
    
    setStoragePersisted: (isPersisted) => set({ isStoragePersisted: isPersisted }),

    checkWebGPUSupport: async () => {
        if (!navigator.gpu) {
            set({ isWebGPUSupported: false });
            return false;
        }
        try {
            const adapter = await navigator.gpu.requestAdapter();
            const supported = !!adapter;
            set({ isWebGPUSupported: supported });
            return supported;
        } catch (e) {
            set({ isWebGPUSupported: false });
            return false;
        }
    }
}));
