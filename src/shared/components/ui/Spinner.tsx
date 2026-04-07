import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    label?: string;
    variant?: 'primary' | 'accent' | 'white';
}

/**
 * Premium Orbit Spinner component.
 * Uses SVG for a crisp, high-end feel and CSS variables for theming.
 */
const Spinner: React.FC<SpinnerProps> = ({ 
    size = 'md', 
    className = '', 
    label,
    variant = 'primary'
}) => {
    const sizeMap = {
        sm: 24,
        md: 40,
        lg: 64,
        xl: 96,
    };

    const dimensions = sizeMap[size];
    
    const colorClasses = {
        primary: 'text-(--primary)',
        accent: 'text-(--accent)',
        white: 'text-white',
    };

    return (
        <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
            <div 
                className="relative flex items-center justify-center animate-in"
                style={{ width: dimensions, height: dimensions }}
            >
                {/* Background Ring */}
                <svg
                    className={`absolute inset-0 opacity-20 ${colorClasses[variant]}`}
                    viewBox="0 0 100 100"
                    fill="none"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        strokeWidth="8"
                        stroke="currentColor"
                    />
                </svg>

                {/* Animated Orbit Ring */}
                <svg
                    className={`absolute inset-0 animate-orbit ${colorClasses[variant]}`}
                    viewBox="0 0 100 100"
                    fill="none"
                    style={{ strokeLinecap: 'round' }}
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        strokeWidth="8"
                        stroke="currentColor"
                        strokeDasharray="280"
                        strokeDashoffset="210"
                    />
                </svg>

                {/* Inner Pulsing Core */}
                <div 
                    className={`rounded-full opacity-40 animate-pulse ${
                        variant === 'primary' ? 'bg-(--primary)' : 
                        variant === 'accent' ? 'bg-(--accent)' : 'bg-white'
                    }`}
                    style={{ 
                        width: dimensions * 0.25, 
                        height: dimensions * 0.25 
                    }}
                />
            </div>

            {label && (
                <p className="text-sm sm:text-base font-semibold tracking-wide uppercase text-(--muted-text) animate-in">
                    {label}
                </p>
            )}
        </div>
    );
};

export default Spinner;
