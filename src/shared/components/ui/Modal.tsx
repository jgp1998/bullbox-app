import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from '@/shared/components/ui/Icons';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
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
    size = 'md',
    className = '',
    ...props
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            
            // Add escape key listener
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleEscape);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEscape);
            };
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

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
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div 
                className={`relative w-full ${sizeClasses[size]} bg-(--card) rounded-xl shadow-2xl border border-(--border) overflow-hidden transform transition-all flex flex-col max-h-[90vh] ${className}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                {...props}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-(--border) flex items-center justify-between bg-(--card)">
                    <h2 id="modal-title" className="text-xl font-bold text-(--primary)">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-(--input) text-(--muted-text) hover:text-(--text) transition-colors focus:outline-hidden focus:ring-2 focus:ring-(--primary)"
                        aria-label="Close modal"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 overflow-y-auto grow custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-(--border) bg-(--card) flex justify-end space-x-3">
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

