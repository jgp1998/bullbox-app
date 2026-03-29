import React from 'react';

interface AlertProps {
    title?: string;
    message: string;
    variant?: 'error' | 'warning' | 'success' | 'info';
    className?: string;
}

const Alert: React.FC<AlertProps> = ({ title, message, variant = 'info', className = '' }) => {
    const variantClasses = {
        error: 'bg-red-500/10 border-red-500 text-red-500',
        warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-500',
        success: 'bg-green-500/10 border-green-500 text-green-500',
        info: 'bg-blue-500/10 border-blue-500 text-blue-500',
    };

    return (
        <div className={`p-4 rounded-lg border ${variantClasses[variant]} ${className}`} role="alert">
            {title && <p className="font-bold text-lg mb-1">{title}</p>}
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};

export default Alert;
