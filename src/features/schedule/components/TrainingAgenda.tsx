import React from 'react';
import { ScheduledSession } from '@/shared/types';
import { CalendarIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon, TrashIcon } from '@/shared/components/ui/Icons';
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
    const { t, language } = useI18n();
    const { openModal } = useUIStore();
    const [viewDate, setViewDate] = React.useState(new Date());

    const days = React.useMemo(() => {
        const start = new Date(viewDate);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff); // Start with Monday
        
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
        <Card className="overflow-hidden" data-testid="training-agenda-container">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[var(--primary)]/10 rounded-xl">
                        <CalendarIcon className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div>
                        <h2 data-testid="agenda-title" className="text-xl font-black text-[var(--text)] uppercase tracking-tight leading-none">{t('trainingSchedule.title')}</h2>
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
                        <div key={session.id} className="relative group" data-testid="session-card">
                            <div className="absolute -inset-0.5 bg-[var(--primary)]/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                            <div className="relative flex items-center gap-4 p-4 bg-[var(--background)]/50 rounded-2xl border border-transparent hover:border-[var(--border)] transition-all duration-300">
                                <div className="flex flex-col items-center justify-center min-w-[70px] border-r border-[var(--border)]/50 pr-4">
                                    <span className="text-sm font-black text-[var(--primary)] leading-none">
                                        {session.time}
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-tighter text-[var(--muted-text)] mt-0.5">
                                        {session.date.split('-').slice(1).reverse().join('/')}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-black text-(--text) uppercase tracking-widest truncate" data-testid="session-title">
                                            {session.title}
                                        </h4>
                                        {session.notes && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-(--primary) animate-pulse" title="Has notes" />
                                        )}
                                    </div>
                                    {session.notes && (
                                        <p className="text-[10px] text-(--muted-text) font-medium uppercase tracking-wider line-clamp-1 italic">
                                            {session.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button 
                                        onClick={() => openModal('schedule', session)}
                                        className="p-2 text-(--muted-text) hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition-all active:scale-90"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => onDeleteSession(session.id)}
                                        className="p-2 text-(--muted-text) hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30 select-none bg-[var(--input)] rounded-3xl border border-dashed border-[var(--border)]" data-testid="no-sessions-message">
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



