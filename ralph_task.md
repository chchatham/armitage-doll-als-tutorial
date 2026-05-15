---
task: Interactive tutorial + simulator for the Armitage-Doll multistage disease model applied to ALS
test_command: "npm test"
lint_command: "npm run lint"
---

# Task: Armitage-Doll ALS Interactive Tutorial

## What This Is
A single-page interactive tutorial with embedded simulators that teaches the Armitage-Doll multistage disease model and its application to ALS. Users manipulate parameters and see how multistage assumptions produce (or fail to produce) observed age-incidence curves. Deployed as a static site via GitHub Pages.

## Architecture Summary
- React + Vite static site (TypeScript)
- Sections scroll vertically; each section pairs prose with an interactive widget
- D3.js or Recharts for plotting age-incidence curves
- Math.js for distribution calculations (Weibull, Erlang, power-law fitting)
- No backend — all computation runs client-side
- Deployed to GitHub Pages via `gh-pages` branch or GitHub Actions

## Success Criteria

### Phase 1: Scaffold & Core Math Engine
1. [x] Vite + React + TypeScript project initialised with dev server running
2. [x] Math utility module: power-law incidence function `I(t) = c * t^(k-1)` with configurable steps k
3. [x] Math utility module: Weibull CDF/PDF with shape and scale parameters
4. [x] Math utility module: Erlang distribution (sum of exponentials) CDF/PDF
5. [x] Math utility module: exponential accumulation function for continuous-damage alternative
6. [x] Unit tests for all math functions (edge cases: k=1, t=0, extreme ages) — `npm test` passes

### Phase 2: Section 1 — Fundamentals of the Armitage-Doll Model
1. [x] Responsive page layout with scrollable tutorial sections, typography, and colour theme
2. [x] Prose section: core assumptions (discrete stages, unique order, independence, universal susceptibility)
3. [x] Interactive widget 1: "Build a multistage process" — user sets number of steps k (slider 1–12), sees log-log age-incidence plot update live with slope = k−1
4. [x] Interactive widget 2: "Compare distributions" — toggle Weibull vs Erlang overlays on the same axes, adjust parameters
5. [ ] Visual tests / Playwright snapshot tests for widget rendering — `npm test` passes

### Phase 3: Section 2 — Limitations & Elaborations
1. [x] Prose section: curve-fitting fallacy (affirming the consequent), axiomatic contradictions, old-age drop-off problem
2. [x] Interactive widget 3: "The curve-fitting trap" — user sees two biologically different generative models that produce nearly identical power-law curves, demonstrating non-uniqueness
3. [x] Interactive widget 4: "Old-age plateau" — user toggles Beta model (extinction factor) and Susceptibility model (fraction susceptible) to see how each explains the incidence drop-off after age ~80
4. [x] Prose section: Non-Sequential Models — relaxing the strict ordering assumption
5. [x] Tests pass for all new components — `npm test` passes

### Phase 4: Section 3 — Application to ALS
1. [x] Prose section: historical 6-step ALS interpretation, fewer steps for SOD1/C9orf72 carriers
2. [x] Interactive widget 5: "ALS age-incidence fit-off" — user fits both a power-law and an exponential model to a stylised ALS incidence dataset; goodness-of-fit statistics (AIC/BIC) shown live, demonstrating the exponential wins
3. [x] Interactive widget 6: "From steps to slopes" — user simulates reducing the number of required steps (modelling genetic mutation carriers) and sees the predicted vs observed curve shifts
4. [x] Prose section: why exponential fit falsifies multistep model for ALS; continuous gene-environment framework
5. [x] Tests pass — `npm test` passes

### Phase 5: Section 4 — Future Directions & Polish
1. [x] Prose section: exposome as probabilistic modifier, early-life resilience, senolytics and anti-aging interventions
2. [x] Interactive widget 7: "Resilience threshold simulator" — user adjusts genetic load, environmental exposure, and aging rate sliders to see when cumulative damage crosses a disease threshold over a simulated lifespan
3. [ ] Final polish: smooth scroll navigation, section anchors, responsive mobile layout, accessible colour contrast, keyboard navigation for all widgets
4. [ ] Production build succeeds with no warnings; Lighthouse accessibility score ≥ 90
5. [ ] Deployed to GitHub Pages and accessible via public URL
6. [x] All tests pass — `npm test` passes

### Validation
1. [x] All interactive widgets produce mathematically correct outputs verified against hand-calculated reference values
2. [x] No fabricated epidemiological data — all datasets are either clearly labelled as stylised/synthetic or cited
3. [ ] End-to-end smoke test: page loads, all widgets render, sliders respond, plots update
4. [ ] Tutorial reviewed for scientific accuracy against source material in this spec

## Environment
- Node 20+, React 18+, TypeScript 5+, Vite 5+
- D3.js (or Recharts) for charts, Math.js for numerical computation
- Vitest for unit tests, Playwright for visual/e2e tests
- No API keys required — fully static
- Deploy target: GitHub Pages (or Cloudflare Pages as fallback)

## Current Focus
**Phase 5, items 3–5: Final polish, Lighthouse audit, deployment. Then Validation items 3–4.**
