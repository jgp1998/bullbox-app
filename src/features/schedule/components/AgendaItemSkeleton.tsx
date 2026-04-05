import React from 'react';
import Skeleton from '@/shared/components/ui/Skeleton';

/**
 * Skeleton for a single scheduled session item in the Agenda.
 */
const AgendaItemSkeleton: React.FC = () => {
    return (
        <div className="flex items-center p-4 bg-[var(--input)]/50 rounded-2xl border border-[var(--border)] border-opacity-30 opacity-60">
            {/* Date/Time badge placeholder */}
            <div className="w-12 h-12 rounded-xl bg-[var(--card)] flex flex-col items-center justify-center border border-[var(--border)] shrink-0 mr-4">
                <Skeleton width={20} height={10} className="mb-1" />
                <Skeleton width={30} height={12} className="rounded" />
            </div>
            
            {/* Title and notes placeholder */}
            <div className="flex-grow min-w-0 space-y-2">
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={12} />
            </div>
        </div>
    );
};

export default AgendaItemSkeleton;
