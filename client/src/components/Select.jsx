import { Children, forwardRef, isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

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
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-primary hover:bg-black/5 dark:hover:bg-white/5',
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
