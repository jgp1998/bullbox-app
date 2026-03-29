import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    icon,
    className = '',
    disabled,
    ...props 
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
    
    const variants = {
        primary: "bg-[var(--primary)] text-white hover:opacity-90 focus:ring-[var(--primary)]",
        secondary: "bg-[var(--input)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] focus:ring-[var(--primary)]",
        accent: "bg-[var(--accent)] text-[var(--background)] hover:opacity-90 focus:ring-[var(--accent)]",
        ghost: "bg-transparent text-[var(--muted-text)] hover:text-[var(--primary)] hover:bg-[var(--input)]",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    };

    const sizes = {
        sm: "py-1.5 px-3 text-xs",
        md: "py-2 px-4 text-sm",
        lg: "py-3 px-6 text-base",
        icon: "p-2",
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : icon ? (
                <span className={children ? "mr-2" : ""}>{icon}</span>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
