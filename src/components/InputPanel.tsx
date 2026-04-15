import { useRef } from 'react';
import { formatArgs } from '../lib/parser';
import type { ParsedArg, InputFormat } from '../types';

interface Props {
  label: string;
  name: string;
  onNameChange: (v: string) => void;
  value: string;
  onChange: (v: string) => void;
  parsed: ParsedArg[];
  format: InputFormat;
  colorClass: string; // border/accent color
}

const PLACEHOLDERS: Record<InputFormat, (label: string) => string> = {
  cli: (label) => `Paste ${label} CLI args here...\ne.g.  --model /path/to/model --tp 4 --port 30000`,
  yaml: (label) => `Paste ${label} YAML here...\ne.g.\nmodel:\n  path: /path/to/model\ntp: 4\nport: 30000`,
};

export function InputPanel({ label, name, onNameChange, value, onChange, parsed, format, colorClass }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopyNormalized = () => {
    const normalized = formatArgs(parsed);
    navigator.clipboard.writeText(normalized);
  };

  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`font-semibold text-sm tracking-wide ${colorClass}`}>{label}</span>
          <input
            type="text"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="Custom name"
            className={`text-sm font-semibold bg-transparent border-b border-dashed border-gray-600 focus:outline-none focus:border-gray-400 ${colorClass} w-28 placeholder-gray-600`}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {value.trim() && (
            <span className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-300 font-mono uppercase tracking-wide">
              {format}
            </span>
          )}
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
        placeholder={PLACEHOLDERS[format](label)}
        className="w-full h-48 resize-y rounded-lg border border-gray-600 bg-gray-800 text-gray-100 text-sm font-mono p-3 focus:outline-none focus:border-gray-400 placeholder-gray-600"
        spellCheck={false}
      />
    </div>
  );
}
