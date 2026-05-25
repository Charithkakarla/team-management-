import { forwardRef } from 'react';
import { cn } from '../utils/cn';

export const Input = forwardRef(function Input({ className, label, error, ...props }, ref) {
  return (
    <label className="grid gap-2">
      {label ? <span className="text-sm font-medium text-text-primary">{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          'h-10 rounded-xl border border-border bg-surface px-3.5 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20',
          className,
          error && 'border-danger focus:border-danger focus:ring-danger/10'
        )}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
});
