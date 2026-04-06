import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'circle' | 'rect' | 'text';
    shimmer?: boolean;
}

/**
 * Enhanced Skeleton component with Shimmer effect.
 * Uses system variables for design consistency.
 */
const Skeleton: React.FC<SkeletonProps> = ({ 
    className = '', 
    width, 
    height, 
    variant = 'rect',
    shimmer = true
}) => {
    // Base skeleton styling
    const baseClasses = `bg-(--input) overflow-hidden relative`;
    
    // Pulse is kept as a backup or if shimmer is disabled
    const animationClass = shimmer ? 'animate-shimmer' : 'animate-pulse opacity-50';
    
    const variantClasses = {
        circle: 'rounded-full',
        rect: 'rounded-xl',
        text: 'rounded-md h-4 mb-2',
    };

    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div 
            className={`${baseClasses} ${variantClasses[variant]} ${animationClass} ${className}`}
            style={style}
        >
            {/* Shimmer overlay for extra polish if shimmer is on */}
            {shimmer && (
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
            )}
        </div>
    );
};

export default Skeleton;
