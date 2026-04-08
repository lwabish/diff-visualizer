import type { DiffRow as DiffRowType } from '../types';

interface Props {
  row: DiffRowType;
}

const STATUS_STYLES: Record<DiffRowType['status'], string> = {
  same: 'bg-transparent text-gray-300',
  changed: 'bg-amber-950/60 text-amber-100',
  'only-a': 'bg-red-950/60 text-red-100',
  'only-b': 'bg-green-950/60 text-green-100',
};

const VALUE_A_STYLES: Record<DiffRowType['status'], string> = {
  same: 'text-gray-400',
  changed: 'text-amber-300 font-medium',
  'only-a': 'text-red-300',
  'only-b': 'text-gray-600 italic',
};

const VALUE_B_STYLES: Record<DiffRowType['status'], string> = {
  same: 'text-gray-400',
  changed: 'text-amber-300 font-medium',
  'only-a': 'text-gray-600 italic',
  'only-b': 'text-green-300',
};

function displayValue(v: string | null | undefined): string {
  if (v === undefined) return '—';
  if (v === null) return '(flag)';
  return v;
}

export function DiffRow({ row }: Props) {
  const rowStyle = STATUS_STYLES[row.status];
  const valAStyle = VALUE_A_STYLES[row.status];
  const valBStyle = VALUE_B_STYLES[row.status];

  return (
    <tr className={`border-b border-gray-800 ${rowStyle}`}>
      <td className="py-1.5 px-3 font-mono text-sm font-medium whitespace-nowrap">{row.key}</td>
      <td className={`py-1.5 px-3 font-mono text-sm ${valAStyle} break-all`}>
        {displayValue(row.valueA)}
      </td>
      <td className={`py-1.5 px-3 font-mono text-sm ${valBStyle} break-all`}>
        {displayValue(row.valueB)}
      </td>
    </tr>
  );
}
