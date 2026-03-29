import React from 'react';
import { ScheduledSession } from '@/types';
import { CalendarIcon, PlusIcon, EditIcon, TrashIcon } from '@/src/shared/components/ui/Icons';
import { useI18n } from '@/context/i18n';
import Card from '@/src/shared/components/ui/Card';
import Button from '@/src/shared/components/ui/Button';

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
        <Card>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center">
                    <CalendarIcon className="w-6 h-6 mr-3 text-[var(--primary)]" />
                    <h2 className="text-2xl font-bold text-[var(--text)]">{t('trainingSchedule.title')}</h2>
                </div>
                <Button
                    onClick={onAddSession}
                    variant="primary"
                    size="md"
                    icon={<PlusIcon className="w-5 h-5" />}
                    className="w-full sm:w-auto"
                >
                    {t('trainingSchedule.scheduleButton')}
                </Button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {sortedSessions.length > 0 ? (
                    sortedSessions.map(session => (
                        <div key={session.id} className="bg-[var(--input)] p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-transparent hover:border-[var(--primary)] transition-all animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2 flex-grow min-w-0">
                                <p className="font-black text-lg text-[var(--text)] truncate uppercase tracking-tight" title={session.title}>
                                    {session.title}
                                </p>
                                <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest bg-[var(--primary)] bg-opacity-10 px-2 py-1 rounded inline-block">
                                    {formatSessionTime(session.date, session.time)}
                                </p>
                                {session.notes && (
                                    <div className="mt-3 p-3 bg-[var(--card)] rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--primary)] shadow-inner">
                                        <p className="text-sm text-[var(--muted-text)] italic leading-relaxed font-medium">
                                            "{session.notes}"
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 self-end sm:self-center bg-[var(--card)] sm:bg-transparent p-2 sm:p-0 rounded-lg border border-[var(--border)] sm:border-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEditSession(session)}
                                    title={t('trainingSchedule.editSession')}
                                    icon={<EditIcon className="w-5 h-5" />}
                                    className="hover:text-[var(--primary)]"
                                />
                                <div className="w-px h-4 bg-[var(--border)] sm:hidden"></div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDeleteSession(session.id)}
                                    title={t('trainingSchedule.deleteSession')}
                                    icon={<TrashIcon className="w-5 h-5 text-red-500" />}
                                    className="hover:text-red-500"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-[var(--input)] rounded-xl border border-dashed border-[var(--border)]">
                        <p className="text-[var(--muted-text)] font-medium">{t('trainingSchedule.noSessions')}</p>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 10px;
                }
            `}</style>
        </Card>
    );
};

export default TrainingSchedule;


