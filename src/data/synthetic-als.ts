// SYNTHETIC DATA — not real epidemiological measurements.
// Shape inspired by published ALS age-incidence patterns (peak ~70-75, decline after ~80)
// but values are exaggerated (~3x real peak rates) for visual clarity.
// Real ALS incidence peaks at roughly 6-8 per 100k person-years.
// References for real data: Logroscino et al. 2010, Chiò et al. 2013.

export const syntheticALSIncidence: [number, number][] = [
  [30, 0.4],
  [35, 0.8],
  [40, 1.8],
  [45, 3.5],
  [50, 6.2],
  [55, 9.8],
  [60, 14.5],
  [65, 19.2],
  [70, 22.8],
  [75, 23.5],
  [80, 21.0],
  [85, 16.5],
  [90, 11.0],
];

// Per 100,000 person-years. Clearly labelled as SYNTHETIC.
export const SYNTHETIC_LABEL =
  'Synthetic ALS-like incidence (per 100k person-years). Not real data — shape mimics published patterns; absolute values are exaggerated for visual clarity (real peak ≈ 6–8/100k).';
