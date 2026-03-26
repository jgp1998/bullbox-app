import React from 'react';
import { WorkoutRecord } from '../../types';
import { TrophyIcon, BookOpenIcon } from '../Icons';
import { formatValue, getUnit, kgToLbs, lbsToKg } from '../../utils/formatters';
import { useI18n } from '../../context/i18n';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface PersonalBestsProps {
  records: WorkoutRecord[];
  onShowDetails: (exerciseName: string) => void;
}

const WeightDisplay: React.FC<{ record: WorkoutRecord }> = ({ record }) => {
  const isKg = record.unit === 'kg' || !record.unit;
  const mainValue = record.value;
  const convertedValue = isKg ? kgToLbs(mainValue) : lbsToKg(mainValue);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-[var(--accent)]">{mainValue.toFixed(1)}</span>
        <span className="text-sm font-normal text-[var(--muted-text)] ml-1">{isKg ? 'kg' : 'lbs'}</span>
      </div>
      <p className="text-xs text-[var(--muted-text)] mt-0.5">
        ({convertedValue.toFixed(1)} {isKg ? 'lbs' : 'kg'})
      </p>
    </div>
  );
};

const PersonalBests: React.FC<PersonalBestsProps> = ({ records, onShowDetails }) => {
  const { t } = useI18n();
  
  return (
    <Card 
        title={t('personalBests.title')} 
        icon={<TrophyIcon className="w-6 h-6 text-yellow-500" />} // I'll add icon prop to Card if I want, or just put it in title
    >
      <div className="flex items-center mb-6">
         <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
         <h3 className="text-xl font-bold text-[var(--text)]">{t('personalBests.title')}</h3>
      </div>

      {records.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {records.map(record => (
            <div key={record.id} className="relative bg-[var(--input)] p-4 sm:p-5 rounded-2xl text-center group border border-transparent hover:border-[var(--primary)] transition-all shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onShowDetails(record.exercise)}
                  className="absolute top-2 right-2 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title={t('personalBests.viewDetails', { exercise: record.exercise })}
                  icon={<BookOpenIcon className="w-4 h-4" />}
                />
              <div className="space-y-3">
                <p className="font-black text-[10px] sm:text-xs text-[var(--muted-text)] uppercase tracking-widest truncate px-2" title={record.exercise}>
                    {record.exercise}
                </p>
                <div className="font-black">
                   {record.type === 'Weight' ? (
                      <WeightDisplay record={record} />
                   ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex items-baseline justify-center">
                            <span className="text-2xl sm:text-3xl font-black text-[var(--accent)] tracking-tighter">{formatValue(record.value, record.type)}</span>
                            <span className="text-xs font-bold text-[var(--muted-text)] ml-1 uppercase">{getUnit(record.type)}</span>
                        </div>
                      </div>
                   )}
                </div>
                <div className="flex justify-center">
                    <p className="text-[9px] sm:text-[10px] text-[var(--muted-text)] font-black bg-[var(--card)] px-2 py-0.5 rounded-full border border-[var(--border)] uppercase tracking-tighter">
                        {new Date(record.date).toLocaleDateString()}
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
            <p className="text-[var(--muted-text)]">{t('personalBests.noPBs')}</p>
        </div>
      )}
    </Card>
  );
};

export default PersonalBests;
