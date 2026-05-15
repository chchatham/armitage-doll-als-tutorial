# Armitage-Doll ALS Interactive Tutorial

## Session Recovery (READ THIS FIRST)
If you're starting a new session, recovering from compaction, or running in a Ralph loop:
1. Read `.ralph/ralph_task.md` — the anchor. Has all checkboxes. Defines "done."
2. Read `.ralph/progress.md` — what exists, what's broken, what to do next.
3. Read `.ralph/guardrails.md` — learned constraints. Follow every sign.
4. Do NOT re-read the full codebase unless progress.md says something is broken. Trust the files.
5. Pick up the "Current Focus" from progress.md and work on it.
6. Before exiting or if context feels heavy: update progress.md with what you did and what's next.

## Compaction Instructions
When compacting this conversation, preserve:
- Current task and its completion state
- Any new guardrails discovered this session
- Any new known issues
- The exact next step to take
Do NOT preserve: file contents already read, full command outputs, failed approaches
(log failures to .ralph/errors.log instead).

## Project Purpose
An interactive, single-page web tutorial that teaches the Armitage-Doll multistage disease model — its fundamentals, mathematical machinery, critical limitations, and application to ALS. Each concept is paired with a hands-on simulator widget so users can manipulate parameters and build intuition. The tutorial culminates by showing why the classic multistep model fails for ALS and what continuous gene-environment frameworks look like instead.

## Architecture

```
src/
├── main.tsx                — React entry point, mounts <App />
├── App.tsx                 — Top-level layout: nav + scrollable sections
├── math/
│   ├── power-law.ts        — I(t) = c * t^(k-1), log-log slope utilities
│   ├── weibull.ts          — Weibull PDF/CDF with shape k and scale λ
│   ├── erlang.ts           — Erlang PDF/CDF (sum of k exponentials with rate μ)
│   ├── exponential.ts      — Continuous exponential accumulation model
│   └── fitting.ts          — Least-squares + AIC/BIC for power-law vs exponential fit
├── components/
│   ├── Section.tsx          — Reusable prose + widget layout container
│   ├── PlotCanvas.tsx       — D3-powered responsive SVG chart wrapper
│   ├── Slider.tsx           — Accessible range slider with label + value display
│   └── ResetButton.tsx      — "Reset to defaults" for all widgets
├── sections/
│   ├── S1_Fundamentals.tsx  — Prose + Widget 1 (multistage builder) + Widget 2 (distribution comparison)
│   ├── S2_Limitations.tsx   — Prose + Widget 3 (curve-fitting trap) + Widget 4 (old-age plateau)
│   ├── S3_ALS.tsx           — Prose + Widget 5 (fit-off) + Widget 6 (steps to slopes)
│   └── S4_Future.tsx        — Prose + Widget 7 (resilience threshold simulator)
├── data/
│   └── synthetic-als.ts     — Synthetic ALS-like incidence data (clearly labelled)
└── styles/
    └── global.css           — CSS variables, typography, responsive breakpoints
```

## Key Interfaces

### Math function signatures (all pure functions, no side effects)
```typescript
// power-law.ts
export function incidence(t: number, k: number, c?: number): number;
export function logLogSlope(k: number): number; // returns k - 1

// weibull.ts
export function weibullPDF(t: number, k: number, lambda: number): number;
export function weibullCDF(t: number, k: number, lambda: number): number;

// erlang.ts
export function erlangPDF(t: number, k: number, mu: number): number;
export function erlangCDF(t: number, k: number, mu: number): number;

// exponential.ts
export function exponentialAccumulation(t: number, rate: number): number;

// fitting.ts
export interface FitResult {
  model: 'power-law' | 'exponential';
  params: Record<string, number>;
  residuals: number[];
  aic: number;
  bic: number;
}
export function fitPowerLaw(data: [number, number][]): FitResult;
export function fitExponential(data: [number, number][]): FitResult;
```

### Widget props pattern (all widgets follow this)
```typescript
interface WidgetProps {
  id: string;              // unique DOM id for accessibility
  defaultParams: Record<string, number>;
  onParamChange?: (params: Record<string, number>) => void;
}
```

## Environment
- Node 20+
- React 18+, TypeScript 5+, Vite 5+
- D3.js v7 for SVG charting
- Math.js for numerical computation where needed
- Vitest for unit tests
- Playwright for e2e tests
- No API keys, no backend, no database
- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm test` — Vitest unit tests
- `npm run test:e2e` — Playwright e2e tests
- `npm run deploy` — push `dist/` to gh-pages branch

## Design Principles
1. **Correctness over aesthetics** — every formula must match its textbook definition; every chart must be mathematically accurate. A beautiful but wrong chart is worse than an ugly correct one.
2. **Progressive disclosure** — tutorial scrolls top-to-bottom; each section builds on the previous. Widgets reference concepts introduced in prose above them.
3. **All computation client-side** — no server, no API calls, no loading spinners for math. Widgets must feel instant.
4. **Synthetic data only** — never present fabricated numbers as real epidemiological data. Always label synthetic datasets as such. Cite real studies by name when referencing published findings.
5. **Accessible by default** — keyboard navigation, screen-reader descriptions for all charts, line-style differentiation (not colour alone), high contrast.
6. **Static deployment** — the build output is a folder of HTML/CSS/JS. No runtime dependencies. GitHub Pages is the target.
