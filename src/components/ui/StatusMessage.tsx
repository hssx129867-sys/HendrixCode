import type { ReactNode } from 'react';
import './StatusMessage.css';

export type StatusType = 'info' | 'success' | 'warning' | 'error';

interface StatusMessageProps {
  type?: StatusType;
  children: ReactNode;
  onClose?: () => void;
}

export const StatusMessage = ({
  type = 'info',
  children,
  onClose,
}: StatusMessageProps) => {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div className={`ui-status-message ui-status-message--${type}`}>
      <span className="ui-status-message__icon">{icons[type]}</span>
      <div className="ui-status-message__content">{children}</div>
      {onClose && (
        <button
          className="ui-status-message__close"
          onClick={onClose}
          aria-label="Close message"
        >
          ✕
        </button>
      )}
    </div>
  );
};
