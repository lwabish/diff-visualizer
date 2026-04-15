export type InputFormat = 'cli' | 'yaml';

export interface ParsedArg {
  key: string;
  value: string | null; // null = boolean flag
}

export type DiffStatus = 'same' | 'changed' | 'only-a' | 'only-b';

export interface DiffRow {
  key: string;
  valueA: string | null | undefined; // undefined = key not present in A
  valueB: string | null | undefined;
  status: DiffStatus;
}
