# Progress Log

## Last Updated
2026-05-15 — Accessibility polish complete. Playwright e2e + axe audit passing. Vite leftovers cleaned.

## What Exists Right Now
- Full Vite + React + TypeScript project (`npm run dev` works, `npm run build` clean)
- **Math modules** (5 files in `src/math/`): power-law, weibull, erlang, exponential, fitting
- **32 unit tests** all passing (`npm test`)
- **12 Playwright e2e tests** all passing (`npm run test:e2e`):
  - 10 smoke tests: page load, sections, nav, all 7 widgets, all 7 plots, slider interaction, reset buttons, skip link, aria descriptions
  - 2 accessibility tests: axe-core WCAG 2.1 AA audit (zero serious/critical violations), keyboard accessibility verification
- **Reusable components** (3 in `src/components/`): PlotCanvas (D3 SVG), Slider, ResetButton
- **4 tutorial sections** (in `src/sections/`), each with prose + interactive widgets:
  - `S1_Fundamentals.tsx` — Widget 1 (multistage builder, k slider 1–12, log-log plot), Widget 2 (Weibull vs Erlang overlay)
  - `S2_Limitations.tsx` — Widget 3 (curve-fitting trap: power-law vs exponential overlap), Widget 4 (old-age plateau: beta extinction + susceptibility depletion)
  - `S3_ALS.tsx` — Widget 5 (ALS fit-off with live AIC/BIC), Widget 6 (steps to slopes: general pop vs carriers)
  - `S4_Future.tsx` — Widget 7 (resilience threshold: genetic load + env + aging → onset age)
- **Synthetic ALS dataset** (`src/data/synthetic-als.ts`) — labelled synthetic, cites real study names
- **Global CSS** (`src/styles/global.css`) — variables, typography, responsive breakpoints, smooth scroll, skip link, focus-visible styles
- **App.tsx** — wires all 4 sections with nav anchor links, skip-link target
- **Accessibility**: skip-to-content link, focus-visible outlines, all WCAG 2.1 AA contrast ratios passing, all plots have aria descriptions, sliders have labels + aria-valuenow/aria-live
- Production build: ~274kB JS, no warnings
- Vite template leftovers cleaned up (index.css, App.css, assets/ removed)

## What's NOT Built Yet (2 items remain)
1. GitHub Pages deployment (Phase 5 item 5)
2. Scientific accuracy review of tutorial prose (Validation item 4)

## Current Focus
Phase 5, item 5: GitHub Pages deployment.

## Next After Current Focus
Validation item 4 (scientific accuracy review of tutorial prose), then done.

## Known Issues
- None active

## Decisions Made (Do Not Revisit)
- React + Vite + TypeScript (not Next.js)
- D3.js for charting (not Recharts — needed full axis/annotation control)
- Vitest for unit tests; separate `vitest.config.ts` to avoid tsc type errors
- Test files excluded from `tsconfig.app.json` via explicit exclude
- E2e files excluded from vitest via `exclude: ['e2e/**']` in vitest.config.ts
- Exponential fit: grid search + coordinate descent (~2% tolerance on scale recovery — acceptable for tutorial)
- Synthetic ALS data: stylised values inspired by published patterns, clearly labelled, not real
- All widgets have reset buttons, aria descriptions, and line-style differentiation (solid/dashed)
- CSS import changed from `index.css` to `styles/global.css` in main.tsx
- Text highlight color changed from `#e94560` to `#b91c1c` (passes 4.5:1 contrast on #fafafa)
- Chart line color `#9ca3af` darkened to `#6b7280` (passes 3:1 for graphical elements)
- Playwright uses Vite preview server (port 4173), axe-core for WCAG audit
