import type { ParsedArg } from '../types';

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
