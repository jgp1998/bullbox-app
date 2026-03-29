import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'circle' | 'rect' | 'text';
}

/**
 * A highly customizable Skeleton component for loading states.
 * Uses system variables for design consistency.
 */
const Skeleton: React.FC<SkeletonProps> = ({ 
    className = '', 
    width, 
    height, 
    variant = 'rect' 
}) => {
    const baseClasses = 'animate-pulse bg-[var(--input)] opacity-50';
    
    const variantClasses = {
        circle: 'rounded-full',
        rect: 'rounded-lg',
        text: 'rounded h-4 mb-2',
    };

    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div 
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
