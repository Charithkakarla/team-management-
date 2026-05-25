import { cn } from '../utils/cn';

const tones = {
  primary: 'border-primary/20 bg-primary/10 text-primary',
  success: 'border-success/20 bg-success/10 text-success',
  danger: 'border-danger/20 bg-danger/10 text-danger',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  muted: 'border-border bg-black/5 text-text-muted dark:bg-white/5'
};

export const Badge = ({ className, tone = 'muted', children }) => (
  <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide', tones[tone], className)}>
    {children}
  </span>
);
