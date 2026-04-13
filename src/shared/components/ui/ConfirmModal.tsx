import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { useI18n } from '@/shared/context/i18n';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isDanger = false,
}) => {
  const { t } = useI18n();

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        {cancelText || t('common.cancel')}
      </Button>
      <Button 
        variant={isDanger ? 'danger' : 'primary'} 
        onClick={() => {
          onConfirm();
          onClose();
        }}
      >
        {confirmText || t('common.confirm')}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="sm">
      <div className="py-2">
        <p className="text-(--muted-text)">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
