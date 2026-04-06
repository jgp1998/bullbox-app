import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, description, footer, ...props }) => {
    return (
        <div className={`bg-(--card) p-6 rounded-lg shadow-lg border border-(--border) overflow-hidden transition-all duration-300 ${className}`} {...props}>
            {(title || description) && (
                <div className="mb-4">
                    {title && <h3 className="text-xl font-bold text-(--text)">{title}</h3>}
                    {description && <p className="text-sm text-(--muted-text) mt-1">{description}</p>}
                </div>
            )}
            <div className="relative">
                {children}
            </div>
            {footer && (
                <div className="mt-6 pt-4 border-t border-(--border) flex justify-end space-x-2">
                    {footer}
                </div>
            )}
        </div>
    );
};


export default Card;
