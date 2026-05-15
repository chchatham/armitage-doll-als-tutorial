export interface FitResult {
  model: 'power-law' | 'exponential';
  params: Record<string, number>;
  residuals: number[];
  aic: number;
  bic: number;
}

// Least-squares fit of log(y) = log(c) + (k-1)·log(t) via linear regression in log-log space.
export function fitPowerLaw(data: [number, number][]): FitResult {
  const filtered = data.filter(([t, y]) => t > 0 && y > 0);
  const n = filtered.length;
  const logT = filtered.map(([t]) => Math.log(t));
  const logY = filtered.map(([, y]) => Math.log(y));

  const meanLogT = logT.reduce((a, b) => a + b, 0) / n;
  const meanLogY = logY.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (logT[i] - meanLogT) * (logY[i] - meanLogY);
    den += (logT[i] - meanLogT) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanLogY - slope * meanLogT;

  const k = slope + 1;
  const c = Math.exp(intercept);

  const residuals = filtered.map(([t, y]) => y - c * Math.pow(t, k - 1));
  const rss = residuals.reduce((sum, r) => sum + r * r, 0);
  const numParams = 2;
  const aic = n * Math.log(rss / n) + 2 * numParams;
  const bic = n * Math.log(rss / n) + numParams * Math.log(n);

  return { model: 'power-law', params: { k, c }, residuals, aic, bic };
}

// Least-squares fit of y = scale · (1 − exp(−rate · t)) via grid search + refinement.
export function fitExponential(data: [number, number][]): FitResult {
  const filtered = data.filter(([t, y]) => t > 0 && y > 0);
  const n = filtered.length;
  const maxY = Math.max(...filtered.map(([, y]) => y));

  let bestRate = 0.01;
  let bestScale = maxY;
  let bestRSS = Infinity;

  // Coarse grid search
  for (let rateExp = -4; rateExp <= 0; rateExp += 0.25) {
    const rate = Math.pow(10, rateExp);
    for (let scaleFactor = 0.5; scaleFactor <= 3; scaleFactor += 0.25) {
      const scale = maxY * scaleFactor;
      let rss = 0;
      for (const [t, y] of filtered) {
        const pred = scale * (1 - Math.exp(-rate * t));
        rss += (y - pred) ** 2;
      }
      if (rss < bestRSS) {
        bestRSS = rss;
        bestRate = rate;
        bestScale = scale;
      }
    }
  }

  // Nelder-Mead-style refinement (coordinate descent)
  for (let iter = 0; iter < 100; iter++) {
    for (const factor of [0.9, 0.95, 1.0, 1.05, 1.1]) {
      const tryRate = bestRate * factor;
      for (const sFactor of [0.95, 1.0, 1.05]) {
        const tryScale = bestScale * sFactor;
        let rss = 0;
        for (const [t, y] of filtered) {
          const pred = tryScale * (1 - Math.exp(-tryRate * t));
          rss += (y - pred) ** 2;
        }
        if (rss < bestRSS) {
          bestRSS = rss;
          bestRate = tryRate;
          bestScale = tryScale;
        }
      }
    }
  }

  const residuals = filtered.map(([t, y]) => y - bestScale * (1 - Math.exp(-bestRate * t)));
  const rss = residuals.reduce((sum, r) => sum + r * r, 0);
  const numParams = 2;
  const aic = n * Math.log(rss / n) + 2 * numParams;
  const bic = n * Math.log(rss / n) + numParams * Math.log(n);

  return { model: 'exponential', params: { rate: bestRate, scale: bestScale }, residuals, aic, bic };
}
