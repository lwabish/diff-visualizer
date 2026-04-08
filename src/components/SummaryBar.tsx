import type { DiffStatus } from '../types';
import type { DiffSummary } from '../lib/diff';

interface Props {
  summary: DiffSummary;
  total: number;
  activeFilters: Set<DiffStatus>;
  onToggleFilter: (status: DiffStatus) => void;
}

export function SummaryBar({ summary, total, activeFilters, onToggleFilter }: Props) {
  if (total === 0) return null;

  const items: { label: string; status: DiffStatus; count: number; color: string; dot: string }[] = [
    { label: 'Same', status: 'same', count: summary.same, color: 'text-gray-400', dot: 'bg-gray-500' },
    { label: 'Changed', status: 'changed', count: summary.changed, color: 'text-amber-400', dot: 'bg-amber-500' },
    { label: 'Only A', status: 'only-a', count: summary.onlyA, color: 'text-red-400', dot: 'bg-red-500' },
    { label: 'Only B', status: 'only-b', count: summary.onlyB, color: 'text-green-400', dot: 'bg-green-500' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm py-2">
      {items.map(({ label, status, count, color, dot }) => {
        const isActive = activeFilters.has(status);
        return (
          <button
            key={label}
            onClick={() => onToggleFilter(status)}
            className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-opacity cursor-pointer select-none ${color} ${isActive ? 'opacity-30' : 'opacity-100'}`}
            title={isActive ? `Show ${label}` : `Hide ${label}`}
          >
            <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
            <span className="font-medium">{count}</span>
            <span className="text-gray-500">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
