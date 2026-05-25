// Toast state: manages app-wide success and error messages.
// It shows temporary notifications from anywhere in the app.
// Use this file to understand the alert system.
import { createContext, useContext, useMemo, useState } from 'react';
import { Bell, CircleCheck, CircleAlert, X } from 'lucide-react';
import { cn } from '../shared/cn';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = (id) => setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));

  const push = (toast) => {
    const id = ++toastId;
    setToasts((currentToasts) => [...currentToasts, { id, tone: 'info', ...toast }]);
    window.setTimeout(() => dismiss(id), toast.duration || 3200);
  };

  const value = useMemo(
    () => ({
      push,
      success: (message) => push({ tone: 'success', message }),
      error: (message) => push({ tone: 'error', message }),
      info: (message) => push({ tone: 'info', message })
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex w-[min(92vw,360px)] flex-col gap-3">
        {toasts.map((toast) => {
          const icon =
            toast.tone === 'success' ? <CircleCheck className="h-5 w-5 text-success" /> :
            toast.tone === 'error' ? <CircleAlert className="h-5 w-5 text-danger" /> :
            <Bell className="h-5 w-5 text-primary" />;

          return (
            <div
              key={toast.id}
              className={cn(
                'animate-fadeUp rounded-2xl border border-border/70 bg-surface/95 p-4 shadow-soft backdrop-blur-xl',
                'flex items-start gap-3'
              )}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 text-sm text-text-primary">{toast.message}</div>
              <button onClick={() => dismiss(toast.id)} className="rounded-lg p-1 text-text-muted transition hover:bg-black/5 hover:text-text-primary dark:hover:bg-white/5">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
};
