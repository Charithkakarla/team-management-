import { forwardRef } from 'react';
import { cn } from '../utils/cn';

export const Textarea = forwardRef(function Textarea({ className, label, error, rows = 4, ...props }, ref) {
  return (
    <label className="grid gap-2">
      {label ? <span className="text-sm font-medium text-text-primary">{label}</span> : null}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary/10',
          className,
          error && 'border-danger focus:border-danger focus:ring-danger/10'
        )}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
});
