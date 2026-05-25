// Core UI building blocks used across the dashboard pages.
// Core UI building blocks used across the dashboard pages.
// It groups the reusable buttons, cards, inputs, tables, and modals.
// Use this file to understand the shared UI kit.
import { Children, createElement, forwardRef, isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '../shared/cn';

const buttonVariants = {
  primary: 'bg-primary text-white shadow-sm shadow-primary/15 hover:bg-primary-600',
  secondary: 'border border-border bg-surface text-text-primary hover:bg-blue-50 dark:hover:bg-white/5',
  ghost: 'text-text-primary hover:bg-blue-50 dark:hover:bg-white/5',
  destructive: 'bg-danger text-white hover:brightness-110'
};

const buttonSizes = {
  sm: 'h-8 px-3 text-xs font-medium',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-5 text-sm'
};

// Button: primary action control used by forms, modals, and headers.
export const Button = ({ className, variant = 'primary', size = 'md', as: Component = 'button', ...props }) => (
  <Component
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg disabled:pointer-events-none disabled:opacity-60',
      buttonVariants[variant],
      buttonSizes[size],
      className
    )}
    {...props}
  />
);

// Card: simple surface container for panels and sections.
export const Card = ({ className, children }) => (
  <div className={cn('rounded-2xl border border-border bg-surface p-5 shadow-soft transition', className)}>{children}</div>
);

const badgeTones = {
  primary: 'border-primary/20 bg-primary/10 text-primary',
  success: 'border-success/20 bg-success/10 text-success',
  danger: 'border-danger/20 bg-danger/10 text-danger',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  muted: 'border-border bg-black/5 text-text-muted dark:bg-white/5'
};

// Badge: compact label for statuses and tags.
export const Badge = ({ className, tone = 'muted', children }) => (
  <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide', badgeTones[tone], className)}>
    {children}
  </span>
);

// Input: labeled text input with inline error handling.
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

// Textarea: multiline input for notes and descriptions.
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

// Select: custom dropdown used for team and role picking.
export const Select = forwardRef(function Select({ className, label, error, children, ...props }, ref) {
  const { value, onChange, disabled } = props;
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const options = useMemo(
    () =>
      children
        ? Children.toArray(children)
            .filter(isValidElement)
            .map((child) => ({
              value: child.props.value,
              label: child.props.children,
              disabled: child.props.disabled
            }))
        : [],
    [children]
  );

  const selectedOption = options.find((option) => option.value === value) || options.find((option) => option.value === '');

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const selectOption = (nextValue) => {
    if (typeof onChange === 'function') {
      onChange({ target: { value: nextValue } });
    }
    setOpen(false);
  };

  return (
    <label className="grid gap-2" ref={wrapperRef}>
      {label ? <span className="text-sm font-medium text-text-primary">{label}</span> : null}
      <div className="relative">
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            'flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 text-left text-sm text-text-primary outline-none transition-colors duration-200 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20',
            open && 'border-primary',
            error && 'border-danger focus:border-danger focus:ring-danger/10',
            disabled && 'cursor-not-allowed opacity-60',
            className
          )}
        >
          <span className={cn('truncate', selectedOption?.value ? 'text-text-primary' : 'text-text-muted')}>
            {selectedOption?.label || 'Choose an option'}
          </span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-text-muted transition-transform duration-200', open && 'rotate-180')} />
        </button>

        {open ? (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-surface p-2 shadow-lg">
            <div className="max-h-72 overflow-auto">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => selectOption(option.value)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                      isSelected ? 'bg-primary/10 text-primary' : 'text-text-primary hover:bg-black/5 dark:hover:bg-white/5',
                      option.disabled && 'cursor-not-allowed opacity-50'
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected ? <span className="text-xs font-medium uppercase tracking-[0.2em]">Selected</span> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
});

// Table: reusable table frame with loading and empty states.
export const Table = ({ columns, data, renderRow, loading, emptyState }) => (
  <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-gray-50 dark:bg-white/5">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={cn('px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-muted', column.className)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-text-muted">
                Loading...
              </td>
            </tr>
          ) : data.length ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-text-muted">
                {emptyState || 'No records found.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// EmptyState: friendly placeholder when a page has no data yet.
export const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-gray-50 px-6 py-12 text-center dark:bg-white/5">
    <div className="max-w-md">
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
      {actionLabel ? (
        <div className="mt-5">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  </div>
);

// Modal: dialog overlay rendered into the document body.
export const Modal = ({ open, title, description, children, onClose, footer, className }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div className={cn('w-full max-w-2xl animate-fadeUp rounded-2xl border border-border bg-surface p-6 shadow-soft', className)} onClick={(event) => event.stopPropagation()}>
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

// StatCard: dashboard metric tile.
export const StatCard = ({ label, value, helper, icon }) => (
  <Card className="flex items-start justify-between gap-4 p-5">
    <div>
      <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-text-muted">{label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{value}</div>
      {helper ? <div className="mt-2 text-sm text-text-muted">{helper}</div> : null}
    </div>
    <div className="rounded-xl border border-border bg-blue-50 p-3 text-primary dark:bg-white/5">{icon}</div>
  </Card>
);

// Skeleton: lightweight loading placeholder.
export const Skeleton = ({ className = '' }) => <div className={`animate-pulse rounded-2xl bg-black/5 dark:bg-white/5 ${className}`} />;