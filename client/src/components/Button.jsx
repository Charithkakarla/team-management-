import { cn } from '../utils/cn';

const variants = {
  primary: 'bg-primary text-white shadow-sm shadow-primary/15 hover:bg-primary-600',
  secondary: 'border border-border bg-surface text-text-primary hover:bg-blue-50 dark:hover:bg-white/5',
  ghost: 'text-text-primary hover:bg-blue-50 dark:hover:bg-white/5',
  destructive: 'bg-danger text-white hover:brightness-110'
};

const sizes = {
  sm: 'h-8 px-3 text-xs font-medium',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-5 text-sm'
};

export const Button = ({ className, variant = 'primary', size = 'md', as: Component = 'button', ...props }) => (
  <Component
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg disabled:pointer-events-none disabled:opacity-60',
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  />
);
