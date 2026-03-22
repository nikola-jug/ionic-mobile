# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Mobile client for the BFF architecture. Despite the folder name, this is a standard Angular 21 standalone app — there are no Ionic Framework or Capacitor dependencies. It mirrors `angular-ui` in structure and tooling; the project name in `angular.json` is `angular-mobile`.

## Commands

```bash
npm start          # Dev server on http://localhost:4200
npm run build      # Production build → dist/
npm run watch      # Dev build with watch mode
npm test           # Unit tests (Vitest)
```

## Key Patterns

Same as `angular-ui`:
- **Standalone components only** — no NgModules.
- **Signals for state** — prefer `signal()` / `computed()`.
- **Functional providers** — all DI wired in `app.config.ts`.
- **Strict templates** — `strictTemplates: true`.
- **Prettier** — 100-char line width, single quotes.
