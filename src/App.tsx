import { useState, useMemo, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { DiffTable } from './components/DiffTable';
import { SummaryBar } from './components/SummaryBar';
import { parseArgs } from './lib/parser';
import { computeDiff, summarize } from './lib/diff';
import type { DiffStatus } from './types';

export default function App() {
  const [rawA, setRawA] = useState('');
  const [rawB, setRawB] = useState('');
  const [hiddenFilters, setHiddenFilters] = useState<Set<DiffStatus>>(new Set<DiffStatus>(['same']));

  const parsedA = useMemo(() => parseArgs(rawA), [rawA]);
  const parsedB = useMemo(() => parseArgs(rawB), [rawB]);

  const diffRows = useMemo(() => computeDiff(parsedA, parsedB), [parsedA, parsedB]);
  const summary = useMemo(() => summarize(diffRows), [diffRows]);

  const filteredRows = useMemo(
    () => (hiddenFilters.size === 0 ? diffRows : diffRows.filter(r => !hiddenFilters.has(r.status))),
    [diffRows, hiddenFilters],
  );

  const handleToggleFilter = useCallback((status: DiffStatus) => {
    setHiddenFilters(prev => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  }, []);

  const hasDiff = parsedA.length > 0 || parsedB.length > 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold text-white">Arg Visualizer</h1>
          <p className="text-gray-400 text-sm mt-1">
            Paste two sets of Python-style CLI arguments — differences are highlighted after normalization.
          </p>
        </header>

        {/* Input panels */}
        <section className="flex flex-col md:flex-row gap-4">
          <InputPanel
            label="A"
            value={rawA}
            onChange={setRawA}
            parsed={parsedA}
            colorClass="text-red-400"
          />
          <div className="hidden md:flex items-center justify-center text-gray-600 px-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
          <InputPanel
            label="B"
            value={rawB}
            onChange={setRawB}
            parsed={parsedB}
            colorClass="text-green-400"
          />
        </section>

        {/* Diff section */}
        {hasDiff && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Normalized Diff
              </h2>
              <SummaryBar
                summary={summary}
                total={diffRows.length}
                activeFilters={hiddenFilters}
                onToggleFilter={handleToggleFilter}
              />
            </div>
            <DiffTable rows={filteredRows} />
          </section>
        )}

        {!hasDiff && (
          <section className="flex flex-col items-center justify-center gap-3 py-16 text-gray-600">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6M9 12h6M9 15h4" />
            </svg>
            <p className="text-sm">Paste arguments in both panels to compare</p>
          </section>
        )}
      </div>
    </div>
  );
}
