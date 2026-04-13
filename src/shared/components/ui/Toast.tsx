import React, { useEffect, useState } from 'react';
import { XIcon, CheckCircleIcon, XCircleIcon } from './Icons';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    id: string;
    message: string;
    variant?: ToastVariant;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
    id, 
    message, 
    variant = 'success', 
    duration = 3000, 
    onClose 
}) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300); // Match animation duration
    };

    const variantStyles = {
        success: {
            bg: 'bg-green-500/10',
            border: 'border-green-500/50',
            text: 'text-green-500',
            icon: <CheckCircleIcon className="w-5 h-5" />
        },
        error: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/50',
            text: 'text-red-500',
            icon: <XCircleIcon className="w-5 h-5" />
        },
        info: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/50',
            text: 'text-blue-500',
            icon: <CheckCircleIcon className="w-5 h-5" />
        },
        warning: {
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/50',
            text: 'text-yellow-500',
            icon: <XCircleIcon className="w-5 h-5" />
        }
    };

    const style = variantStyles[variant];

    return (
        <div 
            className={`
                flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md min-w-[280px] max-w-sm
                transition-all duration-300 transform
                ${style.bg} ${style.border} ${style.text}
                ${isExiting ? 'opacity-0 translate-y-[-20px] scale-95' : 'opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-top-4'}
            `}
            role="alert"
        >
            <div className="shrink-0">
                {style.icon}
            </div>
            <p className="grow text-sm font-bold tracking-tight">
                {message}
            </p>
            <button 
                onClick={handleClose}
                className="shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Close"
            >
                <XIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
