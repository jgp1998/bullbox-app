import React from 'react';
import { WorkoutRecord } from '../types';
import { TrophyIcon, BookOpenIcon } from '@/components/Icons';
import { formatDuration, kgToLbs, lbsToKg } from '@/utils/formatters';
import { calculate1RM } from '@/src/features/rm-calculator';
import { useI18n } from '@/context/i18n';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface PersonalBestsProps {
  records: WorkoutRecord[];
  onShowDetails: (exerciseName: string) => void;
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

const PersonalBests: React.FC<PersonalBestsProps> = ({ records, onShowDetails }) => {
  const { t } = useI18n();
  
  return (
    <Card title={t('personalBests.title')}>
      <div className="flex items-center mb-6">
         <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
         <h3 className="text-xl font-bold text-[var(--text)]">{t('personalBests.title')}</h3>
      </div>

      {records.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {records.map(record => (
            <div key={record.id} className="relative bg-[var(--input)] p-5 rounded-3xl text-center group border border-transparent hover:border-[var(--primary)] transition-all shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onShowDetails(record.exercise)}
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
                        {new Date(record.date).toLocaleDateString()}
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-[var(--muted-text)] opacity-20" />
            <p className="text-[var(--muted-text)] font-bold max-w-xs mx-auto">{t('personalBests.noPBs')}</p>
        </div>
      )}
    </Card>
  );
};

export default PersonalBests;
