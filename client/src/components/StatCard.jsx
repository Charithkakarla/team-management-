import { Card } from './Card';

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
