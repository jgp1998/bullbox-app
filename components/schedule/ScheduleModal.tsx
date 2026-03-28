import React, { useState, useEffect } from 'react';
import { ScheduledSession } from '../../types';
import { useI18n } from '../../context/i18n';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSession: (session: Omit<ScheduledSession, 'id'>) => void;
  onUpdateSession: (session: ScheduledSession) => void;
  sessionToEdit: ScheduledSession | null;
  initialDate?: string | null;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onAddSession, onUpdateSession, sessionToEdit, initialDate }) => {
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
            setTitle('');
            setDate(initialDate || new Date().toISOString().split('T')[0]);
            setTime(new Date().toTimeString().substring(0, 5));
            setNotes('');
        }
        setError('');
    }
  }, [isOpen, sessionToEdit, isEditing, initialDate]);

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
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={isEditing ? t('modals.editSession') : t('modals.scheduleSession')}
        size="md"
    >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="session-title"
            label={t('modals.sessionTitle')}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('modals.sessionTitlePlaceholder')}
            required
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Input
                label={t('modals.sessionDate')}
                type="date"
                id="session-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <Input
                label={t('modals.sessionTime')}
                type="time"
                id="session-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
            />
          </div>

          <Input
            id="session-notes"
            label={t('modals.sessionNotes')}
            type="textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('modals.sessionNotesPlaceholder')}
            rows={4}
          />

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          
          <Button
            type="submit"
            className="w-full"
            size="lg"
          >
            {isEditing ? t('modals.saveChanges') : t('modals.addSession')}
          </Button>
        </form>
    </Modal>
  );
};

export default ScheduleModal;
