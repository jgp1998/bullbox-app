import React from 'react';
import { WorkoutRecord } from '../types';
import { TrophyIcon, BookOpenIcon } from './Icons';
import { formatValue, getUnit, kgToLbs, lbsToKg } from '../utils/formatters';
import { useI18n } from '../context/i18n';

interface PersonalBestsProps {
  records: WorkoutRecord[];
  onShowDetails: (exerciseName: string) => void;
}

const WeightDisplay: React.FC<{ record: WorkoutRecord }> = ({ record }) => {
  const isKg = record.unit === 'kg' || !record.unit;
  const mainValue = record.value;
  const convertedValue = isKg ? kgToLbs(mainValue) : lbsToKg(mainValue);

  return (
    <>
      {mainValue.toFixed(1)}{' '}
      <span className="text-base font-normal text-[var(--muted-text)] ml-1">{isKg ? 'kg' : 'lbs'}</span>
      <p className="text-xs text-[var(--muted-text)] mt-1">
        ({convertedValue.toFixed(1)} {isKg ? 'lbs' : 'kg'})
      </p>
    </>
  );
};

const PersonalBests: React.FC<PersonalBestsProps> = ({ records, onShowDetails }) => {
  const { t } = useI18n();
  return (
    <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-[var(--primary)] flex items-center">
        <TrophyIcon className="w-6 h-6 mr-3 text-yellow-400" />
        {t('personalBests.title')}
      </h2>
      {records.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {records.map(record => (
            <div key={record.id} className="relative bg-[var(--background)] p-4 rounded-lg text-center group">
               <button
                  onClick={() => onShowDetails(record.exercise)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-[var(--card)] opacity-0 group-hover:opacity-100 hover:bg-[var(--input)] text-[var(--muted-text)] hover:text-[var(--accent)] transition-all"
                  title={t('personalBests.viewDetails', { exercise: record.exercise })}
                  aria-label={t('personalBests.viewDetails', { exercise: record.exercise })}
                >
                  <BookOpenIcon className="w-4 h-4" />
                </button>
              <div className="transform group-hover:scale-105 transition-transform duration-200">
                <p className="font-bold text-lg text-[var(--secondary)] truncate" title={record.exercise}>{record.exercise}</p>
                <div className="text-2xl font-bold text-[var(--accent)] mt-1">
                   {record.type === 'Weight' ? (
                      <WeightDisplay record={record} />
                   ) : (
                      <>
                        {formatValue(record.value, record.type)}
                        <span className="text-base font-normal text-[var(--muted-text)] ml-1">{getUnit(record.type)}</span>
                      </>
                   )}
                </div>
                <p className="text-xs text-[var(--muted-text)] mt-1">{new Date(record.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[var(--muted-text)]">{t('personalBests.noPBs')}</p>
      )}
    </div>
  );
};

export default PersonalBests;