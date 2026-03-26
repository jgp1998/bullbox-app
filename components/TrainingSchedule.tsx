import React from 'react';
import { ScheduledSession } from '../types';
import { CalendarIcon, PlusIcon, EditIcon, TrashIcon } from './Icons';
import { useI18n } from '../context/i18n';

interface TrainingScheduleProps {
  sessions: ScheduledSession[];
  onAddSession: () => void;
  onEditSession: (session: ScheduledSession) => void;
  onDeleteSession: (id: string) => void;
}

const TrainingSchedule: React.FC<TrainingScheduleProps> = ({ sessions, onAddSession, onEditSession, onDeleteSession }) => {
    const { t, language } = useI18n();
    
    const sortedSessions = [...sessions].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });

    const formatSessionTime = (date: string, time: string) => {
        const dateTime = new Date(`${date}T${time}`);
        const locale = language === 'es' ? 'es-ES' : 'en-US';
        return dateTime.toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[var(--primary)] flex items-center">
                    <CalendarIcon className="w-6 h-6 mr-3" />
                    {t('trainingSchedule.title')}
                </h2>
                <button
                    onClick={onAddSession}
                    className="flex items-center space-x-2 bg-[var(--primary)] text-white py-2 px-4 rounded-md font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>{t('trainingSchedule.scheduleButton')}</span>
                </button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {sortedSessions.length > 0 ? (
                    sortedSessions.map(session => (
                        <div key={session.id} className="bg-[var(--background)] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <p className="font-bold text-lg text-[var(--text)]">{session.title}</p>
                                <p className="text-sm text-[var(--accent)]">{formatSessionTime(session.date, session.time)}</p>
                                {session.notes && <p className="text-sm text-[var(--muted-text)] mt-1 italic">"{session.notes}"</p>}
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-center">
                                <button
                                    onClick={() => onEditSession(session)}
                                    className="p-2 rounded-full text-[var(--muted-text)] hover:text-[var(--accent)] hover:bg-[var(--input)] transition-colors"
                                    title={t('trainingSchedule.editSession')}
                                >
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onDeleteSession(session.id)}
                                    className="p-2 rounded-full text-[var(--muted-text)] hover:text-red-500 hover:bg-[var(--input)] transition-colors"
                                    title={t('trainingSchedule.deleteSession')}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-[var(--muted-text)] py-8">{t('trainingSchedule.noSessions')}</p>
                )}
            </div>
        </div>
    );
};

export default TrainingSchedule;