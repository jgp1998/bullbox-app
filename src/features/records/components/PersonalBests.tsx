import React from 'react';
import { WorkoutRecord } from '@/shared/types';
import { TrophyIcon, BookOpenIcon } from '@/shared/components/ui/Icons';
import { formatDuration, kgToLbs, lbsToKg, formatDate } from '@/shared/utils/formatters';
import { calculate1RM } from '@/shared/utils/calculator';
import { useI18n } from '@/shared/context/i18n';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import RecordCardSkeleton from './RecordCardSkeleton';
import { useNavigate, Link } from 'react-router-dom';

import { useUIStore } from '@/shared/store/useUIStore';

interface PersonalBestsProps {
  records: WorkoutRecord[];
  isLoading?: boolean;
  showAiAnalysis?: boolean;
}

const RMDisplay: React.FC<{ record: WorkoutRecord }> = ({ record }) => {
  const { t } = useI18n();
  const isKg = record.unit === 'kg' || !record.unit;
  const unit = isKg ? 'kg' : 'lbs';
  const otherUnit = isKg ? 'lbs' : 'kg';
  
  const rmValue = calculate1RM(record.weight, record.reps);
  const convertedRM = isKg ? kgToLbs(rmValue) : lbsToKg(rmValue);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-black text-(--accent) tracking-tighter tabular-nums">
          {rmValue.toFixed(1)}
        </span>
        <span className="text-xs font-black text-(--muted-text) uppercase">{unit}</span>
      </div>
      <p className="text-[10px] font-black text-(--muted-text) uppercase tracking-tighter opacity-80">
        {t('personalBests.estRM')} ({convertedRM.toFixed(1)} {otherUnit})
      </p>
    </div>
  );
};

const PersonalBests: React.FC<PersonalBestsProps> = ({ records, isLoading, showAiAnalysis = false }) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { openModal } = useUIStore();
  
  return (
    <Card title={t('personalBests.title')}>
      <div className="flex items-center mb-6">
         <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
         <h3 className="text-xl font-bold text-(--text)">{t('personalBests.title')}</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <RecordCardSkeleton key={i} />
          ))
        ) : records.length > 0 ? (
          records.map(record => (
            <div key={record.id} className="relative bg-(--input) p-5 rounded-3xl text-center group border border-transparent hover:border-(--primary) transition-all shadow-sm">
              <div className="space-y-4">
                <p className="font-black text-[10px] text-(--muted-text) uppercase tracking-widest truncate px-4" title={record.exercise}>
                    {record.exercise}
                </p>
                <div className="font-black">
                   {record.weight ? (
                      <RMDisplay record={record} />
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex items-baseline justify-center space-x-1">
                            <span className="text-3xl font-black text-(--accent) tracking-tighter tabular-nums">
                                {record.time ? formatDuration(record.time) : (record.reps || 0)}
                            </span>
                            <span className="text-xs font-black text-(--muted-text) ml-1 uppercase">
                                {record.time ? t('common.min') : t('common.reps')}
                            </span>
                        </div>
                      </div>
                    )}
                </div>
                <div className="flex justify-center">
                    <p className="text-[9px] text-(--muted-text) font-black bg-(--card) px-3 py-1 rounded-full border border-(--border) uppercase tracking-tighter">
                        {formatDate(record.date)}
                    </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 px-4 bg-(--input)/30 rounded-[2.5rem] border-2 border-dashed border-(--border)/50 flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-(--primary)/10 rounded-full flex items-center justify-center mb-2 animate-bounce-slow">
                <TrophyIcon className="w-10 h-10 text-(--primary) opacity-40" />
              </div>
              <div className="space-y-2">
                <p className="text-(--text) font-black text-xl uppercase italic tracking-tight">{t('personalBests.noPBs')}</p>
                <p className="text-(--muted-text) font-medium text-sm max-w-xs mx-auto">
                  {t('personalBests.noPBsDescription')}
                </p>
              </div>
            <Link to="/entrenar">
              <Button 
                variant="primary" 
                className="mt-4 px-8 shadow-xl shadow-(--primary)/20"
              >
                {t('nav.train')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PersonalBests;

