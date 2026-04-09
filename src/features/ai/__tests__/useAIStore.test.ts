import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAIStore } from "../store/useAIStore";

describe("useAIStore", () => {
    beforeEach(() => {
        useAIStore.setState({
            engineStatus: 'uninitialized',
            progress: 0,
            progressText: '',
            isWebGPUSupported: null,
            error: null,
        });
    });

    it("should initialize with default state", () => {
        const state = useAIStore.getState();
        expect(state.engineStatus).toBe('uninitialized');
        expect(state.progress).toBe(0);
        expect(state.isWebGPUSupported).toBeNull();
    });

    it("should update progress", () => {
        const store = useAIStore.getState();
        store.setProgress({ progress: 0.5, text: "Loading weights...", timeElapsed: 10 });
        
        const state = useAIStore.getState();
        expect(state.progress).toBe(0.5);
        expect(state.progressText).toBe("Loading weights...");
    });

    it("should handle errors", () => {
        const store = useAIStore.getState();
        store.setError("GPU not found");
        
        const state = useAIStore.getState();
        expect(state.engineStatus).toBe('error');
        expect(state.error).toBe("GPU not found");
    });

    it("should check WebGPU support (mock failure)", async () => {
        // @ts-ignore
        delete global.navigator.gpu;
        const store = useAIStore.getState();
        const supported = await store.checkWebGPUSupport();
        
        expect(supported).toBe(false);
        expect(useAIStore.getState().isWebGPUSupported).toBe(false);
    });
});
