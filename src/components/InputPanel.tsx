import { useRef } from 'react';
import { formatArgs } from '../lib/parser';
import type { ParsedArg } from '../types';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  parsed: ParsedArg[];
  colorClass: string; // border/accent color
}

export function InputPanel({ label, value, onChange, parsed, colorClass }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopyNormalized = () => {
    const normalized = formatArgs(parsed);
    navigator.clipboard.writeText(normalized);
  };

  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className={`font-semibold text-sm tracking-wide ${colorClass}`}>{label}</span>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{parsed.length} args</span>
          <button
            onClick={handleCopyNormalized}
            disabled={parsed.length === 0}
            className="px-2 py-0.5 rounded border border-gray-600 hover:border-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Copy normalized
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={`Paste ${label} args here...\ne.g.  --model /path/to/model --tp 4 --port 30000`}
        className="w-full h-48 resize-y rounded-lg border border-gray-600 bg-gray-800 text-gray-100 text-sm font-mono p-3 focus:outline-none focus:border-gray-400 placeholder-gray-600"
        spellCheck={false}
      />
    </div>
  );
}
