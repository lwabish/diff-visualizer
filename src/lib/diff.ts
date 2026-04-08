import type { ParsedArg, DiffRow } from '../types';

/**
 * Produce a unified diff between two ParsedArg arrays.
 * Result is sorted alphabetically by key.
 */
export function computeDiff(argsA: ParsedArg[], argsB: ParsedArg[]): DiffRow[] {
  const mapA = new Map(argsA.map(a => [a.key, a.value]));
  const mapB = new Map(argsB.map(b => [b.key, b.value]));

  const allKeys = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort((a, b) =>
    a.localeCompare(b)
  );

  return allKeys.map(key => {
    const inA = mapA.has(key);
    const inB = mapB.has(key);
    const valueA = mapA.get(key); // undefined if not present
    const valueB = mapB.get(key);

    let status: DiffRow['status'];
    if (inA && inB) {
      status = valueA === valueB ? 'same' : 'changed';
    } else if (inA) {
      status = 'only-a';
    } else {
      status = 'only-b';
    }

    return { key, valueA, valueB, status };
  });
}

export interface DiffSummary {
  same: number;
  changed: number;
  onlyA: number;
  onlyB: number;
}

export function summarize(rows: DiffRow[]): DiffSummary {
  return rows.reduce(
    (acc, row) => {
      if (row.status === 'same') acc.same++;
      else if (row.status === 'changed') acc.changed++;
      else if (row.status === 'only-a') acc.onlyA++;
      else acc.onlyB++;
      return acc;
    },
    { same: 0, changed: 0, onlyA: 0, onlyB: 0 }
  );
}
