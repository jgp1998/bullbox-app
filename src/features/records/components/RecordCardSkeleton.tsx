import React from 'react';
import Skeleton from '@/shared/components/ui/Skeleton';

/**
 * Skeleton for a single Record card.
 * Mimics the structure of a PersonalBest item.
 */
const RecordCardSkeleton: React.FC = () => {
    return (
        <div data-testid="skeleton" className="bg-(--input) p-5 rounded-3xl border border-(--border) opacity-60 flex flex-col items-center justify-between space-y-4 h-full min-h-[160px]">
            {/* Exercise name placeholder */}
            <Skeleton variant="text" width="60%" className="mx-auto" />
            
            {/* Value (weight/reps) placeholder */}
            <div className="flex flex-col items-center space-y-1">
                <Skeleton width={60} height={40} className="rounded-xl" />
                <Skeleton variant="text" width="40%" height={12} />
            </div>
            
            {/* Date badge placeholder */}
            <Skeleton width="40%" height={24} className="rounded-full" />
        </div>
    );
};

export default RecordCardSkeleton;
