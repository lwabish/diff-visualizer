import type { DiffSummary } from '../lib/diff';

interface Props {
  summary: DiffSummary;
  total: number;
}

export function SummaryBar({ summary, total }: Props) {
  if (total === 0) return null;

  const items = [
    { label: 'Same', count: summary.same, color: 'text-gray-400', dot: 'bg-gray-500' },
    { label: 'Changed', count: summary.changed, color: 'text-amber-400', dot: 'bg-amber-500' },
    { label: 'Only A', count: summary.onlyA, color: 'text-red-400', dot: 'bg-red-500' },
    { label: 'Only B', count: summary.onlyB, color: 'text-green-400', dot: 'bg-green-500' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm py-2">
      {items.map(({ label, count, color, dot }) => (
        <span key={label} className={`flex items-center gap-1.5 ${color}`}>
          <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
          <span className="font-medium">{count}</span>
          <span className="text-gray-500">{label}</span>
        </span>
      ))}
    </div>
  );
}
