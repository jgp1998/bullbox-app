import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CoachInsightCardProps {
    title: string;
    content: string;
    icon: LucideIcon;
    colorClass: string;
    delay?: string;
}

const CoachInsightCard: React.FC<CoachInsightCardProps> = ({ title, content, icon: Icon, colorClass, delay = '0ms' }) => {
    return (
        <div 
            className="bg-(--card) border border-white/5 rounded-2xl p-5 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: delay }}
        >
            <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-xl bg-${colorClass}/10`}>
                    <Icon className={`w-5 h-5 text-${colorClass}`} />
                </div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-(--muted-text)">{title}</h4>
            </div>
            <p className="text-(--text) text-sm leading-relaxed whitespace-pre-line">
                {content}
            </p>
        </div>
    );
};

export default CoachInsightCard;
