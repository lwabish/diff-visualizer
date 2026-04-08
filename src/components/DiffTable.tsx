import type { DiffRow as DiffRowType } from '../types';
import { DiffRow } from './DiffRow';

interface Props {
  rows: DiffRowType[];
}

export function DiffTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
        Enter arguments in both panels above to see the diff
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
            <th className="py-2 px-3 font-medium w-64">Key</th>
            <th className="py-2 px-3 font-medium">
              <span className="text-red-400">A</span> Value
            </th>
            <th className="py-2 px-3 font-medium">
              <span className="text-green-400">B</span> Value
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <DiffRow key={row.key} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
