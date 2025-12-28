import { X } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import '../styles/Toast.css';

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.variant === 'destructive' ? 'toast-destructive' : ''}`}
        >
          <div className="toast-content">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            {toast.description && (
              <div className="toast-description">{toast.description}</div>
            )}
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
          >
            <X />
          </button>
        </div>
      ))}
    </div>
  );
}
