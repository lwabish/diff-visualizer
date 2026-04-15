# Arg Visualizer

A small React + Vite app for comparing two argument sets after normalization.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Deploy to GitHub Pages

This repository is configured for **GitHub Actions auto-deploy**.

1. Push the repository to GitHub.
2. In **Settings -> Pages**, set **Source** to **GitHub Actions**.
3. Push to the `main` branch, or run the **Deploy to GitHub Pages** workflow manually.

The Vite `base` path is inferred automatically during GitHub Actions builds:

- `https://<user>.github.io/` style sites use `/`
- project sites use `/<repository-name>/`
