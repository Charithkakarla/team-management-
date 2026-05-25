import { cn } from '../utils/cn';

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
