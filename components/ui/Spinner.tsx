import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', label }) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-3',
        xl: 'h-16 w-16 border-4',
    };

    return (
        <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            <div className={`animate-spin rounded-full border-b-transparent border-[var(--primary)] ${sizeClasses[size]}`} />
            {label && <p className="text-sm font-medium text-[var(--muted-text)]">{label}</p>}
        </div>
    );
};

export default Spinner;
