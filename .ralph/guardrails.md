# Guardrails — Learned Constraints
# Append-only. Mistakes evaporate. Lessons accumulate.
# Read this FIRST every iteration before doing anything.

## Project-Specific Constraints

### Sign: all epidemiological data must be labelled synthetic or cited
- trigger: creating any dataset, chart, or table showing disease incidence numbers
- instruction: never present numbers as "real ALS data" unless they come from a
  named published study with a citation. Default to clearly labelled synthetic
  datasets that illustrate the mathematical shape, not specific prevalence claims.
- added after: iteration 0 (scientific integrity rule)

### Sign: math functions must match textbook definitions exactly
- trigger: implementing any probability distribution or incidence formula
- instruction: every math function must include a docstring/comment with the
  exact formula it implements and a reference (e.g., "Weibull PDF: f(t) =
  (k/λ)(t/λ)^(k-1) e^(-(t/λ)^k), see Armitage & Doll 1954"). Unit tests
  must verify against hand-calculated values, not just "looks right on the plot."
- added after: iteration 0 (scientific tutorial — correctness is non-negotiable)

### Sign: interactive widgets must degrade gracefully
- trigger: building any slider/input-driven visualisation
- instruction: handle edge cases in widget inputs — zero steps, negative rates,
  extreme ages (0, 120+). Clamp or disable rather than rendering NaN, Infinity,
  or broken axes. Every widget needs a "reset to defaults" button.
- added after: iteration 0 (interactive tools must not confuse the learner)

### Sign: accessibility is not optional for a tutorial
- trigger: any UI work — colours, fonts, layout, interactivity
- instruction: all charts must have text alternatives or aria descriptions.
  Colour alone must not be the only differentiator between curves (use line
  styles: solid, dashed, dotted). Minimum contrast ratio 4.5:1. All widgets
  must be keyboard-navigable.
- added after: iteration 0 (educational content must be inclusive)

### Sign: do not over-engineer the deployment
- trigger: setting up CI/CD or deployment scripts
- instruction: use `vite build` → push `dist/` to `gh-pages` branch via
  `gh-pages` npm package or a simple GitHub Actions workflow. Do not introduce
  Docker, Terraform, or multi-environment configs. This is a static site.
- added after: iteration 0 (keep deployment trivially simple)

### Sign: prose must be scientifically precise but accessible
- trigger: writing any tutorial prose section
- instruction: target audience is a graduate student or early-career researcher
  who knows basic probability but not necessarily the Armitage-Doll model.
  Define every term on first use. Do not assume familiarity with epidemiological
  jargon. Use analogies where helpful but always follow with the precise
  mathematical statement.
- added after: iteration 0 (tutorial, not textbook)

## Code Quality Constraints

### Sign: update state files before exiting
- trigger: end of any Claude Code session or iteration
- instruction: before exiting, update .ralph/progress.md (what was done, what's next),
  check off completed items in .ralph/ralph_task.md, and append a summary to
  .ralph/activity.log. If you discovered a new constraint, add it here.
- added after: iteration 0 (foundational rule)

### Sign: don't modify interfaces without updating all consumers
- trigger: changing function signatures, class fields, or JSON schemas
- instruction: if you change an interface, grep for all call sites and update them.
  Check CLAUDE.md for schema definitions that may also need updating. Changing an
  interface without updating consumers is the #1 cause of "everything broke" iterations.
- added after: iteration 0 (foundational rule)

### Sign: keep vitest config separate from vite config
- trigger: adding test configuration to the project
- instruction: do NOT put a `test` key inside `vite.config.ts` — it causes tsc
  build errors because `tsconfig.node.json` type-checks that file and does not
  include vitest types. Instead, create a separate `vitest.config.ts` that
  imports `defineConfig` from `vitest/config`. Also exclude `*.test.ts` files
  from `tsconfig.app.json` to prevent unused-variable errors during `tsc -b`.
- added after: iteration 1 (build broke because of vitest types in vite config)

### Sign: Vite scaffold into non-empty directory will cancel silently
- trigger: running `npm create vite@latest . -- --template react-ts` in project root
- instruction: if the directory already has files (CLAUDE.md, .ralph/, etc.),
  Vite's create command will abort without error. Scaffold in /tmp first, then
  copy the generated files into the project directory.
- added after: iteration 1 (first scaffold attempt cancelled silently)

### Sign: clean up Vite template leftovers during polish phase
- trigger: reaching final polish / cleanup phase
- instruction: the Vite react-ts template generates `src/index.css`, `src/App.css`,
  and `src/assets/` with logos. These are replaced by our own files but the
  originals may linger. Delete them during polish to avoid confusion. Also check
  `index.html` for template title text.
- added after: iteration 1 (template files left behind after scaffold)

### Sign: widget defaults must visibly demonstrate the text's claim
- trigger: setting default parameters for any interactive widget
- instruction: compute the actual output values at default parameters before
  committing. Verify that the plot VISUALLY shows what the prose says it shows.
  Common failures: (1) curves on different vertical scales so they never overlap,
  (2) decay rates too small to overcome power-law growth so "decline" curves keep
  rising, (3) carrier incidence lower than general population when text says
  "earlier onset," (4) onset age unrealistically young/old for the disease context.
  Run a quick Node script to print values at key ages and check by hand.
- added after: iteration 2 (5 of 7 widgets had defaults that contradicted their text)

### Sign: exponential accumulation ≠ exponential growth
- trigger: comparing a power-law model to an "exponential" alternative
- instruction: 1-exp(-rt) is a saturating function that CANNOT match a power law
  t^(k-1) over any age range when k≥3. For the curve-fitting trap comparison,
  use exponential growth exp(bt) instead. For peaked incidence data, use a
  turnover model c·t^(k-1)·exp(-βt), not accumulation. The literature comparison
  is growth vs power-law, not accumulation vs power-law.
- added after: iteration 2 (Widget 3 had 5 orders of magnitude mismatch, Widget 5
  used a monotonic model for peaked data)

### Sign: exclude e2e directory from vitest
- trigger: adding Playwright e2e tests alongside vitest unit tests
- instruction: add `exclude: ['e2e/**', 'node_modules/**']` to vitest.config.ts.
  Without this, vitest picks up Playwright spec files and reports them as failures
  because they import from `@playwright/test`, not vitest.
- added after: iteration 2 (vitest reported 2 "failed" test files that were e2e specs)

### Sign: text color contrast differs from chart line contrast requirements
- trigger: using the same color for both chart lines (SVG stroke) and inline text
- instruction: WCAG requires 4.5:1 for normal text but only 3:1 for graphical
  elements. A color like #e94560 passes for chart lines on white (3.66:1 > 3:1)
  but fails for text on #fafafa. Use a darker variant for text (e.g., #b91c1c)
  while keeping the brighter color for chart lines. Run axe-core to catch these.
- added after: iteration 2 (axe flagged #e94560 text at 3.66:1 on #fafafa)
