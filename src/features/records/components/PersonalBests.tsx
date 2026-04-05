import React from 'react';
import { WorkoutRecord } from '@/shared/types';
import { TrophyIcon, BookOpenIcon } from '@/shared/components/ui/Icons';
import { formatDuration, kgToLbs, lbsToKg, formatDate } from '@/shared/utils/formatters';
import { calculate1RM } from '@/shared/utils/calculator';
import { useI18n } from '@/shared/context/i18n';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import RecordCardSkeleton from './RecordCardSkeleton';

import { useUIStore } from '@/shared/store/useUIStore';

interface PersonalBestsProps {
  records: WorkoutRecord[];
  isLoading?: boolean;
}

const RMDisplay: React.FC<{ record: WorkoutRecord }> = ({ record }) => {
  const isKg = record.unit === 'kg' || !record.unit;
  const unit = isKg ? 'kg' : 'lbs';
  const otherUnit = isKg ? 'lbs' : 'kg';
  
  const rmValue = calculate1RM(record.weight, record.reps);
  const convertedRM = isKg ? kgToLbs(rmValue) : lbsToKg(rmValue);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-black text-[var(--accent)] tracking-tighter tabular-nums">
          {rmValue.toFixed(1)}
        </span>
        <span className="text-xs font-black text-[var(--muted-text)] uppercase">{unit}</span>
      </div>
      <p className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-tighter opacity-80">
        1RM est. ({convertedRM.toFixed(1)} {otherUnit})
      </p>
    </div>
  );
};

const PersonalBests: React.FC<PersonalBestsProps> = ({ records, isLoading }) => {
  const { t } = useI18n();
  const { openModal } = useUIStore();
  
  return (
    <Card title={t('personalBests.title')}>
      <div className="flex items-center mb-6">
         <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
         <h3 className="text-xl font-bold text-[var(--text)]">{t('personalBests.title')}</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <RecordCardSkeleton key={i} />
          ))
        ) : records.length > 0 ? (
          records.map(record => (
            <div key={record.id} className="relative bg-[var(--input)] p-5 rounded-3xl text-center group border border-transparent hover:border-[var(--primary)] transition-all shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openModal('exerciseDetail', record.exercise)}
                  className="absolute top-3 right-3 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title={t('personalBests.viewDetails', { exercise: record.exercise })}
                  icon={<BookOpenIcon className="w-4 h-4" />}
                />
              <div className="space-y-4">
                <p className="font-black text-[10px] text-[var(--muted-text)] uppercase tracking-widest truncate px-4" title={record.exercise}>
                    {record.exercise}
                </p>
                <div className="font-black">
                   {record.weight ? (
                      <RMDisplay record={record} />
                   ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex items-baseline justify-center space-x-1">
                            <span className="text-3xl font-black text-[var(--accent)] tracking-tighter tabular-nums">
                                {record.time ? formatDuration(record.time) : (record.reps || 0)}
                            </span>
                            <span className="text-xs font-black text-[var(--muted-text)] ml-1 uppercase">
                                {record.time ? 'min' : 'reps'}
                            </span>
                        </div>
                      </div>
                   )}
                </div>
                <div className="flex justify-center">
                    <p className="text-[9px] text-[var(--muted-text)] font-black bg-[var(--card)] px-3 py-1 rounded-full border border-[var(--border)] uppercase tracking-tighter">
                        {formatDate(record.date)}
                    </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
              <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-[var(--muted-text)] opacity-20" />
              <p className="text-[var(--muted-text)] font-bold max-w-xs mx-auto">{t('personalBests.noPBs')}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PersonalBests;

