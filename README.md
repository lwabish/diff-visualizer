# Diff Visualizer

A small React + Vite app for comparing two inputs after normalization.

It is useful for checking differences between CLI arguments and YAML-style config snippets after they are flattened into a comparable form.

## What it does

- Accepts two inputs side by side
- Detects CLI args and YAML automatically
- Normalizes and sorts parsed keys before diffing
- Highlights `Same`, `Changed`, `Only A`, and `Only B`
- Lets you hide individual diff groups from the summary bar
- Supports copying normalized output from each side

## Usage

1. Paste the first input into panel **A** and the second input into panel **B**.
2. Optionally give each side a custom name to make the diff table easier to read.
3. The app detects whether each input looks like CLI args or YAML.
4. Review the normalized diff table and use the summary chips to hide or show categories.
5. Use **Copy normalized** when you want the canonical flattened output for either side.

### Supported input examples

CLI args:

```text
--model /path/to/model --tp 4 --port 30000
```

YAML:

```yaml
model:
  path: /path/to/model
tp: 4
port: 30000
```

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
