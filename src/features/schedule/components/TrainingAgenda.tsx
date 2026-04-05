import React from 'react';
import { ScheduledSession } from '@/shared/types';
import { CalendarIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@/shared/components/ui/Icons';
import { useI18n } from '@/shared/context/i18n';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

import AgendaItemSkeleton from './AgendaItemSkeleton';

import { useUIStore } from '@/shared/store/useUIStore';

interface TrainingAgendaProps {
    sessions: ScheduledSession[];
    onDeleteSession: (id: string) => void;
    isLoading?: boolean;
}

const TrainingAgenda: React.FC<TrainingAgendaProps> = ({ 
    sessions, onDeleteSession, isLoading 
}) => {
    const { openModal } = useUIStore();
    const { t, language } = useI18n();
    const [viewDate, setViewDate] = React.useState(new Date());

    const days = React.useMemo(() => {
        const start = new Date(viewDate);
        start.setDate(start.getDate() - start.getDay() + 1); // Start with Monday
        
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            return {
                date,
                dateStr,
                sessions: sessions.filter(s => s.date === dateStr)
            };
        });
    }, [viewDate, sessions]);

    const navigate = (weeks: number) => {
        const next = new Date(viewDate);
        next.setDate(next.getDate() + (weeks * 7));
        setViewDate(next);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    const formatDayName = (date: Date) => {
        return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' });
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[var(--primary)]/10 rounded-xl">
                        <CalendarIcon className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[var(--text)] uppercase tracking-tight leading-none">{t('trainingSchedule.title')}</h2>
                        <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-widest mt-1 italic">
                            {viewDate.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center bg-[var(--input)] rounded-xl p-1 border border-[var(--border)]">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 min-h-0">
                        <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewDate(new Date())}
                        className="text-[10px] font-black uppercase px-2 h-8 min-h-0"
                    >
                        {t('common.today') || 'Today'}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(1)} className="h-8 w-8 min-h-0">
                        <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
                {days.map((day) => (
                    <div 
                        key={day.dateStr}
                        onClick={() => openModal('schedule', day.dateStr)}
                        className={`flex flex-col items-center p-2 sm:p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                            isToday(day.date) 
                                ? 'bg-[var(--primary)]/10 border-[var(--primary)]' 
                                : 'bg-[var(--background)]/50 border-transparent hover:border-[var(--border)]'
                        }`}
                    >
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${
                            isToday(day.date) ? 'text-[var(--primary)]' : 'text-[var(--muted-text)]'
                        }`}>
                            {formatDayName(day.date)}
                        </span>
                        <span className="text-lg font-black mt-1 leading-none">{day.date.getDate()}</span>
                        <div className="flex space-x-0.5 mt-2">
                            {day.sessions.slice(0, 3).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                            ))}
                            {day.sessions.length > 3 && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--muted-text)]" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 min-h-[100px]">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <AgendaItemSkeleton key={i} />
                    ))
                ) : days.some(d => d.sessions.length > 0) ? (
                    days.flatMap(d => d.sessions).map(session => (
                        <div 
                            key={session.id} 
                            onClick={() => openModal('schedule', session)}
                            className="group flex items-center p-4 bg-[var(--input)]/50 rounded-2xl border border-[var(--border)] border-opacity-30 hover:border-[var(--primary)] hover:border-opacity-100 transition-all cursor-pointer animate-in fade-in"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[var(--card)] flex flex-col items-center justify-center border border-[var(--border)] shrink-0 mr-4">
                                <span className="text-[10px] font-black text-[var(--muted-text)] leading-none uppercase">{session.date.split('-')[2]}</span>
                                <span className="text-xs font-black text-[var(--primary)] mt-0.5">{session.time}</span>
                            </div>
                            <div className="flex-grow min-w-0">
                                <h4 className="font-black text-[var(--text)] uppercase tracking-tight truncate">{session.title}</h4>
                                {session.notes && <p className="text-xs text-[var(--muted-text)] italic truncate mt-0.5">{session.notes}</p>}
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlusIcon className="w-5 h-5 text-[var(--primary)] rotate-45" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30 select-none bg-[var(--input)] rounded-3xl border border-dashed border-[var(--border)]">
                        <CalendarIcon className="w-8 h-8 mb-2" />
                        <p className="text-xs font-black uppercase tracking-widest">{t('trainingSchedule.noSessions')}</p>
                    </div>
                )}
            </div>

            <Button 
                variant="primary" 
                fullWidth 
                className="mt-6 font-black uppercase italic tracking-widest py-3 rounded-2xl"
                onClick={() => openModal('schedule')}
                icon={<PlusIcon className="w-5 h-5" />}
                data-testid="schedule-add-button"
            >
                {t('trainingSchedule.scheduleButton')}
            </Button>
        </Card>
    );
};

export default TrainingAgenda;


