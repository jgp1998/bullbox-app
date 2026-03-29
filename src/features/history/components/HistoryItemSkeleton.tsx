import React from 'react';
import Skeleton from '@/src/shared/components/ui/Skeleton';

/**
 * Skeleton for a single row in WorkoutHistory.
 * Mimics the entry structure with local text, date and actions.
 */
const HistoryItemSkeleton: React.FC = () => {
    return (
        <div className="bg-[var(--input)] p-4 rounded-lg flex items-center justify-between border border-transparent opacity-60">
            <div className="flex flex-col space-y-2 w-1/2">
                {/* Exercise name */}
                <Skeleton variant="text" width="70%" />
                {/* Date */}
                <Skeleton variant="text" width="30%" height={12} />
            </div>
            
            <div className="flex items-center space-x-3">
                {/* Value (weight/reps) */}
                <Skeleton width={40} height={20} className="rounded" />
                
                {/* Action buttons (Analysis + Delete) */}
                <div className="flex space-x-2">
                    <Skeleton variant="circle" width={32} height={32} />
                    <Skeleton variant="circle" width={32} height={32} />
                </div>
            </div>
        </div>
    );
};

export default HistoryItemSkeleton;
