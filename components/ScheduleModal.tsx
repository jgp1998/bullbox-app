import React, { useState, useEffect } from 'react';
import { ScheduledSession } from '../types';
import { XIcon } from './Icons';
import { useI18n } from '../context/i18n';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSession: (session: Omit<ScheduledSession, 'id'>) => void;
  onUpdateSession: (session: ScheduledSession) => void;
  sessionToEdit: ScheduledSession | null;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onAddSession, onUpdateSession, sessionToEdit }) => {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const isEditing = !!sessionToEdit;

  useEffect(() => {
    if (isOpen) {
        if (isEditing) {
            setTitle(sessionToEdit.title);
            setDate(sessionToEdit.date);
            setTime(sessionToEdit.time);
            setNotes(sessionToEdit.notes || '');
        } else {
            // Set defaults for new session
            setTitle('');
            setDate(new Date().toISOString().split('T')[0]);
            setTime(new Date().toTimeString().substring(0, 5));
            setNotes('');
        }
        setError('');
    }
  }, [isOpen, sessionToEdit, isEditing]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !date || !time) {
      setError(t('modals.errors.allFieldsRequired'));
      return;
    }

    if (isEditing) {
      onUpdateSession({ id: sessionToEdit.id, title, date, time, notes });
    } else {
      onAddSession({ title, date, time, notes });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-lg shadow-2xl w-full max-w-md p-6 relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted-text)] hover:text-[var(--primary)] transition-colors"
          aria-label={t('modals.close')}
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--primary)]">
            {isEditing ? t('modals.editSession') : t('modals.scheduleSession')}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="session-title" className="block text-sm font-medium text-[var(--muted-text)] mb-1">{t('modals.sessionTitle')}</label>
            <input
              id="session-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('modals.sessionTitlePlaceholder')}
              className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label htmlFor="session-date" className="block text-sm font-medium text-[var(--muted-text)] mb-1">{t('modals.sessionDate')}</label>
                <input
                    type="date"
                    id="session-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                    required
                />
            </div>
             <div>
                <label htmlFor="session-time" className="block text-sm font-medium text-[var(--muted-text)] mb-1">{t('modals.sessionTime')}</label>
                <input
                    type="time"
                    id="session-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
                    required
                />
            </div>
          </div>
          <div>
            <label htmlFor="session-notes" className="block text-sm font-medium text-[var(--muted-text)] mb-1">{t('modals.sessionNotes')}</label>
            <textarea
              id="session-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('modals.sessionNotesPlaceholder')}
              rows={3}
              className="w-full bg-[var(--input)] text-[var(--text)] p-3 rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity"
          >
            {isEditing ? t('modals.saveChanges') : t('modals.addSession')}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default ScheduleModal;