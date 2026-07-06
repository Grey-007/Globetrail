import React from 'react';
import { Modal } from './Modal';
import { cn } from '@/core/utils/cn';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-textMuted mb-8">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg font-medium text-white hover:bg-white/5 transition-colors focus:outline-none"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none text-white",
            isDestructive ? "bg-error hover:bg-error/90" : "bg-accent-steel hover:bg-accent-steel/90" // Normally use dynamic accent
          )}
          style={!isDestructive ? { backgroundColor: 'var(--color-active-accent)' } : undefined}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
