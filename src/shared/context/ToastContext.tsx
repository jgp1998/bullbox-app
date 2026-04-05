import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ToastVariant } from '@/shared/components/ui/Toast';
import Toast from '@/shared/components/ui/Toast';

interface ToastOptions {
    variant?: ToastVariant;
    duration?: number;
}

interface ToastMessage {
    id: string;
    message: string;
    variant: ToastVariant;
    duration: number;
}

interface ToastContextType {
    showToast: (message: string, options?: ToastOptions) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, options: ToastOptions = {}) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastMessage = {
            id,
            message,
            variant: options.variant || 'success',
            duration: options.duration || 3000,
        };
        
        setToasts((prev) => [...prev, newToast]);
    }, []);

    const showSuccess = useCallback((message: string) => showToast(message, { variant: 'success' }), [showToast]);
    const showError = useCallback((message: string) => showToast(message, { variant: 'error' }), [showToast]);
    const showInfo = useCallback((message: string) => showToast(message, { variant: 'info' }), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
            {children}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            id={toast.id}
                            message={toast.message}
                            variant={toast.variant}
                            duration={toast.duration}
                            onClose={removeToast}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
