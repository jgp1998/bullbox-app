import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from '@/shared/components/ui/Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer,
    size = 'md' 
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
        full: 'max-w-full m-4',
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:pb-20">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div 
                className={`relative bg-[var(--card)] w-full ${sizeClasses[size]} rounded-xl shadow-2xl border border-[var(--border)] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)] sticky top-0 z-10">
                    <h2 id="modal-title" className="text-xl font-bold text-[var(--primary)] truncate pr-8">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-[var(--input)] text-[var(--muted-text)] hover:text-[var(--text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        aria-label="Close modal"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-grow">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 sm:p-6 border-t border-[var(--border)] flex justify-end space-x-3 bg-[var(--card)] sticky bottom-0 z-10">
                        {footer}
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--input);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--border);
                }
            `}</style>
        </div>,
        document.body
    );
};

export default Modal;

