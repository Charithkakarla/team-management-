import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { cn } from '../utils/cn';

export const Modal = ({ open, title, description, children, onClose, footer, className }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div
        className={cn('w-full max-w-2xl animate-fadeUp rounded-2xl border border-border bg-surface p-6 shadow-soft', className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-text-primary">{title}</h3>
            {description ? <p className="mt-1 text-sm text-text-muted">{description}</p> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
        {footer ? <div className="mt-6 flex items-center justify-end gap-3">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
};
