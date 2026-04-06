import React from 'react';
import Spinner from './Spinner';

interface LoadingOverlayProps {
    isLoading: boolean;
    label?: string;
    children?: React.ReactNode;
    className?: string;
}

/**
 * LoadingOverlay component that wraps content and provides a dimmed loading state.
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
    isLoading, 
    label, 
    children, 
    className = '' 
}) => {
    return (
        <div 
            className={`relative ${className}`}
            aria-busy={isLoading}
        >
            {/* Main Content */}
            <div 
                className={`transition-all duration-300 ${isLoading ? 'blur-[2px] opacity-40 pointer-events-none' : 'opacity-100'}`}
                aria-hidden={isLoading}
            >
                {children}
            </div>

            {/* Overlay */}
            {isLoading && (
                <div 
                    className="absolute inset-0 flex items-center justify-center z-10 animate-in rounded-xl bg-black/10 backdrop-blur-[1px]"
                    role="status"
                    aria-live="polite"
                >
                    <Spinner size="lg" label={label} />
                </div>
            )}
        </div>
    );
};

export default LoadingOverlay;
