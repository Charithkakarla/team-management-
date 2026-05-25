import { Button } from './Button';

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
