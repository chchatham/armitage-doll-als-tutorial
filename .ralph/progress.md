# Progress Log

## Last Updated
2026-05-15 — ALL TASKS COMPLETE. Widget defaults audited and fixed. Redeployed.

## What Exists Right Now
- Full Vite + React + TypeScript project (`npm run dev`, `npm run build`, `npm run deploy`)
- **Math modules** (5 files in `src/math/`): power-law, weibull, erlang, exponential, fitting (incl. turnover model)
- **32 unit tests** all passing (`npm test`)
- **12 Playwright e2e tests** all passing (`npm run test:e2e`)
- **4 tutorial sections** with 7 interactive widgets, all defaults verified to demonstrate their intended points
- **Accessibility**: skip link, focus-visible, WCAG 2.1 AA (axe-core zero violations), aria descriptions
- **Scientific accuracy**: prose and widget models reviewed and corrected
- **Deployed**: https://chchatham.github.io/armitage-doll-als-tutorial/
- **GitHub repo**: https://github.com/chchatham/armitage-doll-als-tutorial

## What Was Done This Session
1. **Accessibility polish**: skip-to-content link, focus-visible styles, contrast fixes (#9ca3af→#6b7280, #e94560→#b91c1c for text), meta description, Vite template cleanup
2. **Playwright e2e tests**: 10 smoke + 2 accessibility (axe-core WCAG 2.1 AA)
3. **Git + GitHub Pages**: repo init, pushed to chchatham/armitage-doll-als-tutorial, deployed
4. **Scientific accuracy review**: fixed carrier slope direction, Weibull/Erlang relationship, sequential progression terminology, SOD1 caveat, synthetic data scale note
5. **Widget default audit and fixes** (major):
   - W3: replaced exponential accumulation with exponential growth (old model 5 orders of magnitude off)
   - W4: betaStrength 0.03→0.07, depletion 0.05→0.08 (curves now actually decline after peak age)
   - W5: replaced exponential fit with turnover model c·t^(k-1)·exp(-βt) (RSS 932→80, actually peaks and declines)
   - W6: carrier c multiplier 1e4→2e5 (carriers now show earlier onset as text describes)
   - W7: geneticLoad 0.3→0.05, threshold 0.7→0.8 (onset 24→73, plausible for ALS)

## What's NOT Built Yet
Nothing — all items complete.

## Known Issues
- None active
