import { load as yamlLoad } from 'js-yaml';
import type { ParsedArg } from '../types';
import type { InputFormat } from '../types';

/** Detect input format heuristically */
export function detectFormat(raw: string): InputFormat {
  if (!raw.trim()) return 'cli';
  // YAML: has at least one line with "word: " or "word:\n" (not starting with --)
  if (/^\s*(?!--)\w[\w.-]*\s*:/m.test(raw)) return 'yaml';
  return 'cli';
}

/** Parse input according to the selected format */
export function parseInput(raw: string, format: InputFormat): ParsedArg[] {
  if (format === 'yaml') return parseYaml(raw);
  return parseArgs(raw);
}

/**
 * Parse a raw argument string (single-line, multi-line, or backslash-continued)
 * into a sorted list of ParsedArg entries.
 *
 * Supports:
 *   --key value
 *   --key=value
 *   --flag  (boolean, no value)
 */
export function parseArgs(raw: string): ParsedArg[] {
  // 1. Strip shell line-continuation backslashes and normalize whitespace
  const normalized = raw
    .replace(/\\\n/g, ' ')  // backslash-newline continuation
    .replace(/\\\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ');

  // 2. Tokenize respecting single/double quoted strings
  const tokens = tokenize(normalized);

  // 3. Build ParsedArg list
  const args: ParsedArg[] = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    if (!token.startsWith('-')) {
      // positional or bare value — skip
      i++;
      continue;
    }

    // Handle --key=value form
    const eqIdx = token.indexOf('=');
    if (eqIdx !== -1) {
      const key = token.slice(0, eqIdx);
      const value = stripQuotes(token.slice(eqIdx + 1));
      args.push({ key, value });
      i++;
      continue;
    }

    // Handle --key value or --flag
    const key = token;
    const next = tokens[i + 1];
    if (next !== undefined && !next.startsWith('-')) {
      args.push({ key, value: stripQuotes(next) });
      i += 2;
    } else {
      args.push({ key, value: null });
      i++;
    }
  }

  // 4. Sort alphabetically by key, deduplicate (last wins)
  const map = new Map<string, string | null>();
  for (const arg of args) {
    map.set(arg.key, arg.value);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({ key, value }));
}

/** Format a ParsedArg[] back to canonical text (one arg per line) */
export function formatArgs(args: ParsedArg[]): string {
  return args
    .map(({ key, value }) => (value === null ? key : `${key} ${value}`))
    .join('\n');
}

// ── helpers ────────────────────────────────────────────────────────────────

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inSingle) {
      if (ch === "'") inSingle = false;
      else current += ch;
      continue;
    }
    if (inDouble) {
      if (ch === '"') inDouble = false;
      else current += ch;
      continue;
    }

    if (ch === "'") { inSingle = true; continue; }
    if (ch === '"') { inDouble = true; continue; }

    if (/\s/.test(ch)) {
      if (current) { tokens.push(current); current = ''; }
      continue;
    }

    current += ch;
  }
  if (current) tokens.push(current);
  return tokens;
}

function stripQuotes(s: string): string {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

// ── YAML parser ────────────────────────────────────────────────────────────

/**
 * Parse a YAML string into a sorted list of ParsedArg entries.
 * Nested objects are recursively flattened with dot-notation keys.
 * Array elements are indexed (e.g. servers.0, servers.1).
 */
export function parseYaml(raw: string): ParsedArg[] {
  if (!raw.trim()) return [];

  let parsed: unknown;
  try {
    parsed = yamlLoad(raw);
  } catch {
    return [];
  }

  if (parsed === null || parsed === undefined) return [];
  if (typeof parsed !== 'object') return [];

  const entries: ParsedArg[] = [];
  flattenObject(parsed as Record<string, unknown>, '', entries);

  const map = new Map<string, string | null>();
  for (const arg of entries) {
    map.set(arg.key, arg.value);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({ key, value }));
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix: string,
  result: ParsedArg[],
): void {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;

    if (v === null || v === undefined) {
      result.push({ key, value: null });
    } else if (Array.isArray(v)) {
      v.forEach((item, idx) => {
        const idxKey = `${key}.${idx}`;
        if (item !== null && item !== undefined && typeof item === 'object') {
          flattenObject(item as Record<string, unknown>, idxKey, result);
        } else {
          result.push({ key: idxKey, value: item === null || item === undefined ? null : String(item) });
        }
      });
    } else if (typeof v === 'object') {
      flattenObject(v as Record<string, unknown>, key, result);
    } else {
      result.push({ key, value: String(v) });
    }
  }
}
