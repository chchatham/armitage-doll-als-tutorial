# Progress Log

## Last Updated
2026-05-15 — ALL ITEMS COMPLETE. Tutorial deployed to GitHub Pages.

## What Exists Right Now
- Full Vite + React + TypeScript project (`npm run dev`, `npm run build`, `npm run deploy`)
- **Math modules** (5 files in `src/math/`): power-law, weibull, erlang, exponential, fitting
- **32 unit tests** all passing (`npm test`)
- **12 Playwright e2e tests** all passing (`npm run test:e2e`):
  - 10 smoke tests: page load, sections, nav, all 7 widgets, all 7 plots, slider interaction, reset buttons, skip link, aria descriptions
  - 2 accessibility tests: axe-core WCAG 2.1 AA audit (zero serious/critical violations), keyboard accessibility
- **Reusable components** (3 in `src/components/`): PlotCanvas (D3 SVG), Slider, ResetButton
- **4 tutorial sections**, each with prose + interactive widgets
- **Accessibility**: skip-to-content link, focus-visible outlines, WCAG 2.1 AA contrast passing, aria descriptions on all plots
- **Scientific accuracy**: reviewed and corrected (carrier slope direction, Weibull/Erlang relationship, sequential progression terminology, SOD1 caveat, synthetic data scale note)
- **Deployed**: https://chchatham.github.io/armitage-doll-als-tutorial/
- **GitHub repo**: https://github.com/chchatham/armitage-doll-als-tutorial

## What's NOT Built Yet
Nothing — all items complete.

## Known Issues
- None active
