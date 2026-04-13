import React from 'react';
import { ScheduledSession } from '@/shared/types';
import { CalendarIcon, PlusIcon, EditIcon, TrashIcon } from '@/shared/components/ui/Icons';
import { useI18n } from '@/shared/context/i18n';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import ConfirmModal from '@/shared/components/ui/ConfirmModal';
import { useState } from 'react';

interface TrainingScheduleProps {
  sessions: ScheduledSession[];
  onAddSession: () => void;
  onEditSession: (session: ScheduledSession) => void;
  onDeleteSession: (id: string) => void;
}

const TrainingSchedule: React.FC<TrainingScheduleProps> = ({ sessions, onAddSession, onEditSession, onDeleteSession }) => {
    const { t, language } = useI18n();
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

    const openDeleteConfirm = (id: string) => {
        setSessionToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (sessionToDelete) {
            onDeleteSession(sessionToDelete);
            setSessionToDelete(null);
        }
    };
    
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
                    <CalendarIcon className="w-6 h-6 mr-3 text-(--primary)" />
                    <h2 className="text-2xl font-bold text-(--text)">{t('trainingSchedule.title')}</h2>
                </div>
                <Button
                    onClick={onAddSession}
                    variant="primary"
                    size="md"
                    icon={<PlusIcon className="w-5 h-5" />}
                    className="w-full sm:w-auto"
                    data-testid="schedule-add-button"
                >
                    {t('trainingSchedule.scheduleButton')}
                </Button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {sortedSessions.length > 0 ? (
                    sortedSessions.map(session => (
                        <div className="bg-(--input) p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-transparent hover:border-(--primary) transition-all animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2 grow min-w-0">
                                <p className="font-black text-lg text-(--text) truncate uppercase tracking-tight" title={session.title}>
                                    {session.title}
                                </p>
                                <p className="text-xs font-bold text-(--primary) uppercase tracking-widest bg-(--primary) bg-opacity-10 px-2 py-1 rounded inline-block">
                                    {formatSessionTime(session.date, session.time)}
                                </p>
                                {session.notes && (
                                    <div className="mt-3 p-3 bg-(--card) rounded-xl border border-(--border) border-l-4 border-l-(--primary) shadow-inner">
                                        <p className="text-sm text-(--muted-text) italic leading-relaxed font-medium">
                                            "{session.notes}"
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 self-end sm:self-center bg-(--card) sm:bg-transparent p-2 sm:p-0 rounded-lg border border-(--border) sm:border-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEditSession(session)}
                                    title={t('trainingSchedule.editSession')}
                                    icon={<EditIcon className="w-5 h-5" />}
                                    className="hover:text-(--primary)"
                                />
                                <div className="w-px h-4 bg-(--border) sm:hidden"></div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openDeleteConfirm(session.id)}
                                    title={t('trainingSchedule.deleteSession')}
                                    icon={<TrashIcon className="w-5 h-5 text-red-500" />}
                                    className="hover:text-red-500"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 px-4 bg-(--input)/30 rounded-[2.5rem] border-2 border-dashed border-(--border)/50 flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-(--primary)/10 rounded-full flex items-center justify-center mb-2 animate-pulse">
                            <CalendarIcon className="w-10 h-10 text-(--primary) opacity-40" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-(--text) font-black text-xl uppercase italic tracking-tight">{t('trainingSchedule.noSessions')}</p>
                            <p className="text-(--muted-text) font-medium text-sm max-w-xs mx-auto">
                                Planning is half the battle. Schedule your next workout and stay consistent.
                            </p>
                        </div>
                        <Button 
                            variant="primary" 
                            className="mt-4 px-8 shadow-xl shadow-(--primary)/20"
                            onClick={onAddSession}
                        >
                            {t('trainingSchedule.scheduleButton')}
                        </Button>
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

            <ConfirmModal
                isOpen={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t('modals.confirmDeleteTitle')}
                message={t('common.confirmDelete')}
                isDanger={true}
            />
        </Card>
    );
};

export default TrainingSchedule;


