import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    label?: string;
    error?: string;
    type?: 'text' | 'number' | 'date' | 'time' | 'email' | 'password' | 'select' | 'textarea';
    options?: { value: string; label: string }[]; // For select
    helperText?: string;
    rows?: number;
}

const Input: React.FC<InputProps> = ({ 
    label, 
    error, 
    type = 'text', 
    options = [], 
    className = '', 
    id,
    helperText,
    rows,
    ...props 
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseInputStyles = "w-full bg-(--input) text-(--text) px-3 py-2 sm:py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-(--primary) focus:outline-none placeholder:text-(--muted-text)";
    const borderStyles = error ? "border-red-500 focus:ring-red-500" : "border-(--border) focus:border-(--primary)";

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
                    rows={rows}
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
                <label htmlFor={inputId} className="block text-sm font-medium text-(--muted-text) mb-1">
                    {label}
                </label>
            )}
            {renderInput()}
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            {helperText && !error && <p className="text-xs text-(--muted-text) mt-1">{helperText}</p>}
        </div>
    );
};

export default Input;
