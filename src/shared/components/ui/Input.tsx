import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    label?: string;
    error?: string;
    type?: 'text' | 'number' | 'date' | 'email' | 'password' | 'select' | 'textarea';
    options?: { value: string; label: string }[]; // For select
    helperText?: string;
}

const Input: React.FC<InputProps> = ({ 
    label, 
    error, 
    type = 'text', 
    options = [], 
    className = '', 
    id,
    helperText,
    ...props 
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseInputStyles = "w-full bg-[var(--input)] text-[var(--text)] px-3 py-2 sm:py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none placeholder:text-[var(--muted-text)]";
    const borderStyles = error ? "border-red-500 focus:ring-red-500" : "border-[var(--border)] focus:border-[var(--primary)]";

    const renderInput = () => {
        if (type === 'select') {
            return (
                <select 
                    id={inputId}
                    className={`${baseInputStyles} ${borderStyles} ${className}`}
                    {...(props as any)}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            );
        }

        if (type === 'textarea') {
            return (
                <textarea 
                    id={inputId}
                    className={`${baseInputStyles} ${borderStyles} ${className}`}
                    {...(props as any)}
                />
            );
        }

        return (
            <input 
                id={inputId}
                type={type}
                className={`${baseInputStyles} ${borderStyles} ${className}`}
                {...(props as any)}
            />
        );
    };

    return (
        <div className="w-full space-y-1">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-[var(--muted-text)] mb-1">
                    {label}
                </label>
            )}
            {renderInput()}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {helperText && !error && <p className="text-xs text-[var(--muted-text)] mt-1">{helperText}</p>}
        </div>
    );
};

export default Input;
