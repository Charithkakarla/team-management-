import { cn } from '../utils/cn';

export const Card = ({ className, children }) => (
  <div className={cn('rounded-2xl border border-border bg-surface p-5 shadow-soft transition', className)}>
    {children}
  </div>
);
